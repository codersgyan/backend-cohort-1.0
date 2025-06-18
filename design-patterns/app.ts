/**
 * Chain of responsibility
 */

// class OrderProcessor {
//     process() {
//         // Validate the order
//         console.log('Validation complete!')
//         // Check intentory
//         console.log('Inventory check complete!')
//         // Fraud detection
//         console.log('Fraud detection check complete!')
//         // Payment
//         console.log('Payment complete!')
//         // Arrange shipping
//         console.log('Shipping arrangement complete!')
//         // Notification
//         console.log('Notification sent complete!')
//     }
// }

type Order = {
    id: number
    items: string[]
    paid: boolean
}

interface OrderHandler {
    handle(order: Order): void
    setNext(handler: OrderHandler): OrderHandler
}

abstract class BaseHandler implements OrderHandler {
    private nextHander: OrderHandler | null = null

    abstract process(order: Order): void

    handle(order: Order) {
        this.process(order)
        if (this.nextHander) {
            this.nextHander.handle(order)
        }
    }

    setNext(handler: OrderHandler) {
        this.nextHander = handler
        return handler
    }
}

class ValidationHandler extends BaseHandler {
    process(order: Order) {
        console.log('Handling the order validation')
    }
}

class InventoryHandler extends BaseHandler {
    process(order: Order) {
        console.log('Checking the inventory')
    }
}

class FraudHandler extends BaseHandler {
    process(order: Order) {
        console.log('Checking the fraud')
    }
}

class PaymentHandler extends BaseHandler {
    process(order: Order) {
        console.log('Handling the payment')
    }
}

const order: Order = {
    id: 1,
    items: ['iphone', 'Laptop'],
    paid: false,
}

const validation = new ValidationHandler()
const inventory = new InventoryHandler()
const fraud = new FraudHandler()
const payment = new PaymentHandler()

validation.setNext(inventory).setNext(fraud).setNext(payment)

validation.handle(order)




// Validation -> Inventory -> fraud -> payment -> shipping -> notification
