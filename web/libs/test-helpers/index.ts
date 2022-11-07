import { faker } from "@faker-js/faker";
import ProductModel from "@models/product.model";
import ProductService from "@services/product.service";
import ScheduleService from "@services/schedule.service";
import StaffService from "@services/staff.service";
import { addHours } from "date-fns";

export const createStaff = async () => {
  return await StaffService.create({
    shop: global.shop,
    fullname: faker.name.fullName(),
    email: faker.internet.email(),
    phone: "+4531317411",
  });
};

export const createProduct = async ({
  shopifyProductId,
  duration = 45,
  buffertime = 15,
}) => {
  return await ProductModel.create({
    shop: global.shop,
    collectionId: faker.name.jobTitle(),
    productId: shopifyProductId,
    title: faker.company.name(),
    duration,
    buffertime,
  });
};

interface CreateSchedule {
  staff: string;
  tag: string;
  start?: Date;
  end?: Date;
}
export const createSchedule = async ({
  staff,
  tag,
  start = new Date(),
  end = addHours(new Date(), 5),
}: CreateSchedule) => {
  return await ScheduleService.create({
    staff,
    shop: global.shop,
    schedules: {
      tag,
      start,
      end,
    },
  });
};

export const createNewStaffAndAddToProductWithSchedule = async ({
  product,
  tag,
}) => {
  const staff = await createStaff();

  const updateProduct = await ProductService.addStaff({
    id: product._id.toString(),
    shop: global.shop,
    staff: staff._id.toString(),
    tag,
  });

  const schedule = await createSchedule({
    staff: staff._id.toString(),
    tag,
  });

  return { staff, updateProduct, schedule };
};

export const addStaffToProduct = async ({ staff, product, tag }) => {
  const updateProduct = await ProductService.addStaff({
    id: product._id.toString(),
    shop: global.shop,
    staff: staff._id.toString(),
    tag: tag,
  });

  return { updateProduct };
};
