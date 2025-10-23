/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class CategoryGuard implements CanActivate{
    constructor(private readonly prisma: PrismaService){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        if(!String(request.url).includes("product")){
            return true;
        }

        const roleId = request.user.role;
        const roleInDb = await this.prisma.role.findUnique({
            where:{
                id: roleId,
            }
        });

        if(!roleInDb){
            throw new ForbiddenException("You're not autenticated.");
        }
        const userCategories = roleInDb.categories;

        const postBodyCategory = request.body.category;
        if(postBodyCategory){
            return userCategories.includes(postBodyCategory);
        }
        
        // When /product/name?name=xxx 
        const productName = request.query.name || request.params.name;
        if(productName){
            const result = await this.prisma.product.findMany({
                where: {
                    name: {
                        equals: productName,
                        mode: 'insensitive'
                    }
                },
            });

            if(result.length === 0 ) throw new NotFoundException();

            return result.some(p => userCategories.includes(p.category));
        }

        const productCategory = request.query.category || request.params.category;
        if(productCategory){
            const result = await this.prisma.product.findMany({
                where: {category: productCategory},
                select: {category: true}
            });

            if(result.length === 0 ) throw new NotFoundException();

            return result.some(p => userCategories.includes(p.category));
        }

        const productId = request.query.id || request.params.id;
        if(productId){
            const result = await this.prisma.product.findMany({
                where: {category: productId},
                select: {category: true}
            });
            
            if(result.length === 0 ) throw new NotFoundException();

            return result.some(p => userCategories.includes(p.category));
        }
    }


}