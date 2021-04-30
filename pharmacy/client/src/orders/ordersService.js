import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";
// insurance post test
import insurance from "../serviceClient/apiInsurance"
export const getPolicyByOrderPharmacy = async (payload) => {
    return insurance.post('/policy/getPolicyByOrderPharmacy', payload).then(res => {
        return {
            data: res.data
        };
    });
}
// call api to create order
export const createOrder = async (order) => {
    return await client.post('/orders', order).then(res => {
        return {
            msg: res.msg,
        };
    });
}

// call api to get orders
export const getOrders = async () => {
    return await client.get('/orders').then(orders => {
        return orders;
    })
}
// call api to get order
export const getOrder = async (orderId) => {
    return await client.get(`/orders/${orderId}`).then(order => {
        return order;
    })
}

// call api to patch order
export const patchOrder = async (orderId, orderPartial) => {
    return await client.patch(`/orders/${orderId}`, orderPartial);
}

// call api to delete order
export const deleteOrder = async (orderId) => {
    return await client.delete(`/orders/${orderId}`);
}
