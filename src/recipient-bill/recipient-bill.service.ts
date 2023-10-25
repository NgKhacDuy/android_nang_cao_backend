import { Injectable } from '@nestjs/common';
import { CreateRecipientBillDto } from './dto/create-recipient-bill.dto';
import { UpdateRecipientBillDto } from './dto/update-recipient-bill.dto';
import { Product } from 'src/product/entities/product.entity';
import { RecipientBill } from './entities/recipient-bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';
import {
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { RecipientDetail } from 'src/recipient-detail/entities/recipient-detail.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';

@Injectable()
export class RecipientBillService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(RecipientBill)
    private recipientBillRepository: Repository<RecipientBill>,
    @InjectRepository(RecipientDetail)
    private recipientDetailRepository: Repository<RecipientDetail>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async create(createRecipientBillDto: CreateRecipientBillDto) {
    const supplierExist = await this.supplierRepository.findOneBy({
      id: createRecipientBillDto.supplierId,
    });
    if (!supplierExist) {
      return NotFoundResponse('Supplier not found');
    }
    var listRecipientsDetail = [];
    const recipientBill = new RecipientBill();
    for (let i in createRecipientBillDto.listProduct) {
      const categoryExist = await this.categoryRepository.findOneBy({
        id: createRecipientBillDto.listProduct[i].categoryId,
      });
      if (!categoryExist) {
        return NotFoundResponse('Category not found');
      } else {
        const product = new Product();
        const recipientDetail = new RecipientDetail();
        product.name = createRecipientBillDto.listProduct[i].name;
        product.benefit = createRecipientBillDto.listProduct[i].benefit;
        product.description = createRecipientBillDto.listProduct[i].description;
        product.img = createRecipientBillDto.listProduct[i].img;
        product.money = createRecipientBillDto.listProduct[i].money;
        product.quantity = createRecipientBillDto.listProduct[i].quantity;
        product.size = createRecipientBillDto.listProduct[i].size;
        product.category = categoryExist;
        await this.productRepository.save(product);
        recipientDetail.product = product;
        recipientDetail.money = createRecipientBillDto.listProduct[i].money;
        await this.recipientDetailRepository.save(recipientDetail);
        listRecipientsDetail.push(recipientDetail);
      }
    }
    recipientBill.dateImport = new Date();
    recipientBill.supplier = supplierExist;
    recipientBill.totalMoney = createRecipientBillDto.totalMoney;
    recipientBill.recipientDetail = listRecipientsDetail;
    await this.recipientBillRepository.save(recipientBill);
    return SuccessResponse();
  }

  findAll() {
    return `This action returns all recipientBill`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipientBill`;
  }

  update(id: number, updateRecipientBillDto: UpdateRecipientBillDto) {
    return `This action updates a #${id} recipientBill`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipientBill`;
  }
}
