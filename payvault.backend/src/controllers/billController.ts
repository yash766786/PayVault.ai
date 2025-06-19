import { Request, Response, NextFunction } from "express";
import Bill from "../models/Bill";
import {connectDb} from "../utils/connectDb";
import BillCategory from "../models/BillCategory";
import Vendor from "../models/Vendor";

class BillController {
  static async getRecentBills(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        connectDb();
      const limit = parseInt(req.query.limit as string) || 5;

      const bills = await Bill.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "billcategories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "vendors",
            localField: "vendor",
            foreignField: "_id",
            as: "vendor",
          },
        },
        { $unwind: "$vendor" },
        {
          $project: {
            id: { $toString: "$_id" },
            billNumber: { $ifNull: ["$billNumber", "-"] },
            category: "$category.name",
            vendor: "$vendor.name",
            amount: 1,
            dueDate: 1,
            status: "pending",
          },
        },
      ]);

      res.status(200).json(bills);
      
    } catch (error) {
      console.error("Error fetching recent bills:", error);
      res.status(500).json({ message: "Failed to fetch recent bills" });
    }
  }

static async add_new(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      connectDb();

      const { billNumber, category, vendor, amount, dueDate, status } = req.body;

      if (!billNumber || !category || !vendor || !amount || !dueDate || !status) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      let categoryDoc = await BillCategory.findOne({ name: category });
      if (!categoryDoc) {
        categoryDoc = new BillCategory({ name: category });
        await categoryDoc.save();
      }

      let vendorDoc = await Vendor.findOne({ name: vendor });
      if (!vendorDoc) {
        vendorDoc = new Vendor({ name: vendor });
        await vendorDoc.save();
      }

      let existingBill = await Bill.findOne({ billNumber });
      if (existingBill) {
        res.status(400).json({ message: "Bill with this number already exists" });
        return;
      }

      const newBill = new Bill({
        billNumber,
        category: categoryDoc._id,
        vendor: vendorDoc._id,
        amount,
        dueDate,
        status,
      });

      await newBill.save();

      res.status(201).json({
        message: "New bill added successfully",
        bill: {
          id: newBill._id,
          billNumber: newBill.billNumber,
          category: categoryDoc.name,
          vendor: vendorDoc.name,
          amount: newBill.amount,
          dueDate: newBill.dueDate,
          status: newBill.status,
        },
      });
    } catch (error) {
      console.error("Error adding new bill:", error);
      res.status(500).json({ message: "Failed to add new bill" });
    }
  }

  static async getUpcomingBills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      connectDb();

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 15;
      const status = req.query.status as string || "";
      const type = req.query.type as string || "";
      const vendor = req.query.vendor as string || "";
      const dueDateSort = req.query.dueDate === "asc" ? 1 : -1;

      const now = new Date();

      // Build the base match condition
      const matchConditions: any = {
        $or: [
          { dueDate: { $gt: now }, status: { $in: ["pending", "paid"] } },
          { dueDate: { $lt: now }, status: "overdue" }
        ]
      };

      if (status) matchConditions.status = status;
      if (type) matchConditions["category.name"] = type; // handled after lookup
      if (vendor) matchConditions["vendor.name"] = vendor; // handled after lookup

      const bills = await Bill.aggregate([
        { $match: matchConditions },

        // Lookup category name
        {
          $lookup: {
            from: "billcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: "$category" },

        // Lookup vendor name
        {
          $lookup: {
            from: "vendors",
            localField: "vendor",
            foreignField: "_id",
            as: "vendor"
          }
        },
        { $unwind: "$vendor" },

        // Lookup payment method for paid bills
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "bill",
            as: "payment"
          }
        },

        // Transform to required output
        {
          $project: {
            id: { $toString: "$_id" },
            type: "$category.name",
            vendor: "$vendor.name",
            amount: 1,
            status: 1,
            paymentMethod: {
              $cond: [
                { $eq: ["$status", "paid"] },
                {
                  $ifNull: [
                    { $arrayElemAt: ["$payment.method", 0] },
                    "--"
                  ]
                },
                "--"
              ]
            },
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$dueDate" }
            },
            timestamp: { $toLong: "$dueDate" }
          }
        },

        { $sort: { timestamp: dueDateSort } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);

      res.status(200).json(bills);
    } catch (error) {
      console.error("Error fetching upcoming bills:", error);
      res.status(500).json({ message: "Failed to fetch upcoming bills" });
    }
  }
}

  

export default BillController;
