const orderService = require('../services/order-service');
const orderRepository = require('../repositories/order-repository');
const { publishOrderStatusUpdate } = require('../publishers/order-publisher');

//database mock to prevent DB call when testing without proper setup for testing env
jest.mock('../database', () => {
  return {};
});

jest.mock('../repositories/order-repository');
jest.mock('../publishers/order-publisher');

describe('orderService.updateStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if order does not exist', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      orderService.updateStatus(1, { status: 'SHIPPED' })
    ).rejects.toThrow('Order not found');
  });

  it('should throw if transition is invalid', async () => {
    const fakeOrder = { id: 1, status: 'PENDING' };
    orderRepository.findById.mockResolvedValue(fakeOrder);

    await expect(
      orderService.updateStatus(1, { status: 'SHIPPED' })
    ).rejects.toThrow(
      'Order cannot be updated to this status when it is PENDING');
  });
  
});
