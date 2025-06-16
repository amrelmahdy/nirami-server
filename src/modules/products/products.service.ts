import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Variant } from '../variants/schemas/variant.schema';
import { UpdateProductDto } from './dtos/update-product-dto';
import { GroupsService } from '../groups/groups.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Variant.name) private variantModel: mongoose.Model<Variant>,
        @InjectModel(Product.name) private productModel: mongoose.Model<Product>,
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
        private groupsService: GroupsService,
    ) { }

    async findAll(filters: {
        query?: string;
        groupId?: string;
        categoryId?: string;
        brandId?: string | string[];
        sortBy?: 'isFeatured' | 'isOnSale' | 'priceUp' | 'priceDown' | 'new',
        price?: number;
        priceFrom?: number | string;
        priceTo?: number | string;
    } = {}): Promise<{ total: number; products: Product[]; limit: number; page: number; appliedFilters: any }> {
        const { query, groupId, categoryId, sortBy, price, priceFrom, priceTo } = filters;
        let { brandId } = filters;
        const filter: any = {};

        // Track applied filters
        const appliedFilters: any = {};

        // Name search
        if (query) {
            filter.$or = [
                { 'name.ar': { $regex: query, $options: 'i' } },
                { 'name.en': { $regex: query, $options: 'i' } }
            ];
            appliedFilters.query = query;
        }

        // Handle comma-separated brandId string
        if (typeof brandId === 'string' && brandId.includes(',')) {
            brandId = brandId.split(',').map(id => id.trim());
        }

        // Brand filter: support single or multiple brand IDs
        if (brandId) {
            if (Array.isArray(brandId)) {
                const validBrandIds = brandId.filter(id => mongoose.Types.ObjectId.isValid(id));
                if (validBrandIds.length > 0) {
                    filter.brand = { $in: validBrandIds };
                    appliedFilters.brandId = validBrandIds;
                }
            } else if (mongoose.Types.ObjectId.isValid(brandId)) {
                filter.brand = brandId;
                appliedFilters.brandId = brandId;
            }
        }

        // Filter by categoryId (fetch matching groupIds)
        let categoryGroupIds: string[] = [];
        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            const groups = await this.groupsService.findAll({ categoryId });
            categoryGroupIds = groups.map((g: any) => g._id.toString());
            appliedFilters.categoryId = categoryId;
        }

        // Combine groupId and categoryGroupIds filtering logic
        if (groupId && mongoose.Types.ObjectId.isValid(groupId)) {
            const groupIdStr = groupId.toString();
            if (categoryGroupIds.length > 0) {
                // Both groupId and categoryId filters apply
                if (categoryGroupIds.includes(groupIdStr)) {
                    filter.group = groupId; // it's valid and in category
                    appliedFilters.groupId = groupId;
                } else {
                    // No match → return empty result
                    return {
                        total: 0,
                        products: [],
                        limit: 10,
                        page: 1,
                        appliedFilters: { ...appliedFilters, groupId, categoryId }
                    };
                }
            } else {
                // Only groupId filter applies
                filter.group = groupId;
                appliedFilters.groupId = groupId;
            }
        } else if (categoryId && mongoose.Types.ObjectId.isValid(categoryId) && categoryGroupIds.length > 0) {
            // Only categoryId filter applies (no valid groupId)
            filter.group = { $in: categoryGroupIds };
        } else if (groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
            // Invalid groupId provided, return empty result
            return {
                total: 0,
                products: [],
                limit: 10,
                page: 1,
                appliedFilters: { ...appliedFilters, groupId }
            };
        }

        // Price filter: handle price, priceFrom, priceTo as range on (isOnSale ? salesPrice : price)
        const hasPriceFrom = priceFrom !== undefined && priceFrom !== null && priceFrom !== '';
        const hasPriceTo = priceTo !== undefined && priceTo !== null && priceTo !== '';

        if (hasPriceFrom || hasPriceTo) {
            const exprs: any[] = [];
            if (hasPriceFrom && !isNaN(Number(priceFrom))) {
                exprs.push({
                    $gte: [
                        { $cond: ["$isOnSale", "$salesPrice", "$price"] },
                        Number(priceFrom)
                    ]
                });
                appliedFilters.priceFrom = Number(priceFrom);
            }
            if (hasPriceTo && !isNaN(Number(priceTo))) {
                exprs.push({
                    $lte: [
                        { $cond: ["$isOnSale", "$salesPrice", "$price"] },
                        Number(priceTo)
                    ]
                });
                appliedFilters.priceTo = Number(priceTo);
            }
            if (exprs.length > 0) {
                filter.$expr = exprs.length === 1 ? exprs[0] : { $and: exprs };
            }
        } else if (price !== undefined && price !== null) {
            const priceNumber = Number(price);
            if (!isNaN(priceNumber) && priceNumber > 0) {
                filter.$expr = {
                    $lte: [
                        { $cond: ["$isOnSale", "$salesPrice", "$price"] },
                        priceNumber
                    ]
                };
                appliedFilters.price = priceNumber;
            }
        }

        // Sorting logic
        let sort: any = {};
        if (sortBy === 'isFeatured') {
            sort.isFeatured = -1;
            appliedFilters.sortBy = sortBy;
        } else if (sortBy === 'isOnSale') {
            sort.isOnSale = -1;
            appliedFilters.sortBy = sortBy;
        } else if (sortBy === 'priceUp') {
            sort.price = 1;
            appliedFilters.sortBy = sortBy;
        } else if (sortBy === 'priceDown') {
            sort.price = -1;
            appliedFilters.sortBy = sortBy;
        } else if (sortBy === 'new') {
            sort.createdAt = -1;
            appliedFilters.sortBy = sortBy;
        }


        // Fetch products with sort
        const products = await this.productModel.find(filter)
            .sort(sort)
            .populate([
                'brand',
                'reviews',
                {
                    path: 'group',
                    populate: {
                        path: 'category',
                        populate: {
                            path: 'department',
                        },
                    },
                },
            ]);

        return {
            total: products.length,
            products,
            limit: 10,
            page: 1,
            appliedFilters
        };
    }



    async getMostSaledProducts(): Promise<Product[]> {
        return await this.productModel.find({})
            .populate([
                'brand',
                'reviews',
                {
                    path: 'group',
                    populate: {
                        path: 'category',
                        populate: {
                            path: 'department',
                        },
                    },
                },
            ]);
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).populate([
            'brand',
            'variants',
            'reviews',
            {
                path: 'group',
                populate: {
                    path: 'category',
                    populate: 'department',
                },
            },
        ]);

        if (!product) {
            throw new NotFoundException(`Product not found.`);
        }
        return product;
    }




    async create(product: Product): Promise<Product> {
        const productAlreadyExists = await this.productModel.findOne({ sku: product.sku });
        console.log(productAlreadyExists)
        if (productAlreadyExists) {
            throw new BadRequestException(`Product with SKU ${product.sku} already exits.`)
        }
        return this.productModel.create(product)
    }

    async update(productId: string, product: UpdateProductDto): Promise<Product> {
        console.log(product)
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            productId,
            { $set: product },
            { new: true }
        );

        if (!updatedProduct) {
            throw new NotFoundException('هذا المنتج غير موجود');
        }

        return updatedProduct;
    }

    async addVariantToProduct(productId: string, variant: Variant): Promise<Product> {
        // 1. Fetch the product and populate variants
        const product = await this.productModel.findById(productId).populate('variants');
        if (!product) {
            throw new NotFoundException('هذا المنتج غير موجود');
        }

        // 2. Check for duplicate SKU in existing variants
        const isDuplicate = (product.variants as Variant[]).some((v) => v.sku === variant.sku);
        if (isDuplicate) {
            throw new BadRequestException('يوجد متغير بالفعل برمز التخزين الذي قمت بإدخاله');
        }

        // 3. Create the new variant
        const newVariant = await this.variantModel.create(variant);

        // 4. Add the new variant to the product
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            productId,
            { $push: { variants: newVariant._id } },
            { new: true }
        ).populate('variants');

        if (!updatedProduct) {
            throw new NotFoundException('لم يتم تحديث المنتج بعد إضافة المتغير');
        }

        return updatedProduct;
    }

    async deleteVariantFromProduct(productId: string, variantId: string): Promise<Variant> {
        // 1. Check if the product exists
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new NotFoundException('المنتج غير موجود');
        }

        // 2. Delete the variant from the Variant collection
        const deletedVariant = await this.variantModel.findByIdAndDelete(variantId);
        if (!deletedVariant) {
            throw new NotFoundException('المتغير غير موجود');
        }

        // 3. Remove the variant ID from the product's variants array
        await this.productModel.findByIdAndUpdate(
            productId,
            { $pull: { variants: variantId } }
        );

        return deletedVariant;
    }

    async findByIds(ids: string[]): Promise<Product[]> {
        const products = await this.productModel.find({ _id: { $in: ids } }).populate([
            'brand',
            'variants',
            'reviews',
            {
                path: 'group',
                populate: {
                    path: 'category',
                    populate: 'department',
                },
            },
        ]);
        return products;
    }

    async toggleFavourite(userId: string, productId: string): Promise<Product> {
        // Toggle product in user's favList
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const prodObjId = new mongoose.Types.ObjectId(productId);
        // Fix: cast favList to ObjectId[] for comparison
        const favListIds = (user.favList as unknown as mongoose.Types.ObjectId[]);
        const isFav = favListIds.some((id) => id.equals(prodObjId));

        let update;
        if (isFav) {
            update = { $pull: { favList: prodObjId } };
        } else {
            update = { $addToSet: { favList: prodObjId } };
        }
        await this.userModel.findByIdAndUpdate(userId, update);

        // Return the product (populated)
        const product = await this.productModel.findById(productId)
            .populate([
                'brand',
                'variants',
                'reviews',
                {
                    path: 'group',
                    populate: {
                        path: 'category',
                        populate: 'department',
                    },
                },
            ]);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product as Product;
    }
}

