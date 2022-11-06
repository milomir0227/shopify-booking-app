import {
  addHours,
  getHours,
  isAfter,
  isBefore,
  parseISO,
  subHours,
} from "date-fns";
import * as Schedule from "../../database/models/schedule";
import * as Staff from "../../database/models/staff";

export enum ControllerMethods {
  get = "get",
  create = "create",
  update = "update",
  remove = "remove",
  updateGroup = "updateGroup",
  removeGroup = "removeGroup",
}

const get = async ({ query }) => {
  const { shop, staff } = query;
  if (await Staff.findOne(staff, { shop })) {
    return await Schedule.find({ staff });
  }
};

const create = async ({ query, body }) => {
  const { shop, staff } = query;

  if (await Staff.findOne(staff, { shop })) {
    if (Array.isArray(body)) {
      const groupId = new Date().getTime();
      const schedules = body.map((b) => {
        b.groupId = groupId;
        b.staff = staff;
        return b;
      });
      return await Schedule.insertMany(schedules);
    } else {
      return await Schedule.create({ staff, ...body });
    }
  }
};

const update = async ({ query, body }) => {
  const { shop, staff, schedule } = query;

  if (await Staff.findOne(staff, { shop })) {
    return await Schedule.findByIdAndUpdate(schedule, {
      groupId: null,
      ...body,
    });
  }
};

const remove = async ({ query }) => {
  const { shop, staff, schedule } = query;

  if (await Staff.findOne(staff, { shop })) {
    return await Schedule.remove(schedule);
  }
};

const updateGroup = async ({ query, body }) => {
  const { staff, schedule, groupId, shop } = query;

  const documents = await Schedule.find({
    _id: schedule,
    staff,
    groupId,
  });

  if (documents.length > 0) {
    const bulk = documents.map((d) => {
      const startDateTime = parseISO(body.start);
      const endDateTime = parseISO(body.end);

      let start = new Date(d.start.setHours(getHours(startDateTime)));
      let end = new Date(d.end.setHours(getHours(endDateTime)));

      // startDateTime is before 30 oct
      if (
        isBefore(startDateTime, new Date(d.start.getFullYear(), 9, 30)) &&
        isAfter(start, new Date(d.start.getFullYear(), 9, 30)) // 9 is for october
      ) {
        start = addHours(start, 1);
        end = addHours(end, 1);
      }
      // startDateTime is after 30 oct, and current is before subs
      else if (
        isAfter(startDateTime, new Date(d.start.getFullYear(), 9, 30)) && // 9 is for october
        isBefore(start, new Date(d.start.getFullYear(), 9, 30))
      ) {
        start = subHours(start, 1);
        end = subHours(end, 1);
      }
      // startDateTime is before 27 march, and current is after
      else if (
        isBefore(startDateTime, new Date(d.start.getFullYear(), 2, 27)) &&
        isAfter(start, new Date(d.start.getFullYear(), 2, 27)) // 2 is for march
      ) {
        start = subHours(start, 1);
        end = subHours(end, 1);
      }
      // startDateTime is after 27 march, and current is before
      else if (
        isAfter(startDateTime, new Date(d.start.getFullYear(), 2, 27)) &&
        isBefore(start, new Date(d.start.getFullYear(), 2, 27))
        // 2 is for march
      ) {
        start = addHours(start, 1);
        end = addHours(end, 1);
      }

      return {
        updateOne: {
          filter: { _id: d._id },
          update: {
            $set: {
              start,
              end,
            },
          },
        },
      };
    });

    return await Schedule.Model.bulkWrite(bulk);
  } else {
    throw "Groupid doesn't exist";
  }
};

const removeGroup = async ({ query, body }) => {
  const { shop, staff, schedule, groupId } = query;

  const documents = await Schedule.Model.countDocuments({
    _id: schedule,
    staff,
    groupId,
  });

  if (documents > 0) {
    return await Schedule.Model.deleteMany({ groupId });
  } else {
    throw "Groupid doesn't exist";
  }
};

export default { get, remove, update, updateGroup, removeGroup };
