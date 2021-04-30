import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";
// insurance post test
import insurance from "../serviceClient/apiInsurance"
export const getPolicyBySalePharmacy = async (payload) => {
    return insurance.post('/policy/getPolicyBySalePharmacy', payload).then(res => {
        return {
            data: res.data
        };
    });
}
// call api to create sale
export const createSale = async (sale) => {
    return await client.post('/sales', sale).then(res => {
        return {
            msg: res.msg,
        };
    });
}

// call api to get sales by order id
export const getSalesByOrderId = async (orderId) => {
    return await client.get('/sales/order/' + orderId).then(sales => {
        return sales;
    })
}

// call api to get sales
export const getSales = async () => {
    return await client.get('/sales').then(sales => {
        return sales;
    })
}
// call api to get sale
export const getSale = async (saleId) => {
    return await client.get(`/sales/${saleId}`).then(sale => {
        return sale;
    })
}

// call api to patch sale
export const patchSale = async (saleId, salePartial) => {
    return await client.patch(`/sales/${saleId}`, salePartial);
}

// call api to delete sale
export const deleteSale = async (saleId) => {
    return await client.delete(`/sales/${saleId}`);
}
