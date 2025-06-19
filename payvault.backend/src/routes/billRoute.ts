import { Router } from 'express';
import BillController from '../controllers/billController';

const router = Router();

router.get('/recent', BillController.getRecentBills);
router.post("/add_new",BillController.add_new);
router.post("/upcoming_bill",BillController.getUpcomingBills);
export default router;
