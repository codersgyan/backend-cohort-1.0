// /**
//  * Chain of responsibility pattern
//  */
// // Validate order data (e.g. all required fields present)

// // Check inventory (are items in stock?)

// // Run fraud screening (high-risk orders flagged)

// // Charge the customer’s card

// // Arrange shipping (print labels, schedule pickup)

// // Send confirmation email

// // Before
// class OrderProcessor {
//     process() {
//         // Validate order data (e.g. all required fields present)
//         console.log('validating the order data')
//         // Check inventory (are items in stock?)
//         console.log('Checking the inventory')
//         // Run fraud screening (high-risk orders flagged)
//         console.log('Checking fraud detection')
//         // Charge the customer’s card
//         console.log('process the payment')
//         // Arrange shipping (print labels, schedule pickup)
//         console.log('arrange the shipping')
//         // Send confirmation email
//         console.log('sending confirmation email')
//     }
// }

// const processor = new OrderProcessor()
// // processor.process()

// // before

// type Order = {
//     id: number
//     items: string[]
//     paid: boolean
//     shipped: boolean
// }

// interface OrderHandler {
//     handle(order: Order): void
//     setNext(handler: OrderHandler): OrderHandler
// }

// abstract class BaseHandler implements OrderHandler {
//     private nextHandler: OrderHandler | null = null

//     public setNext(handler: OrderHandler): OrderHandler {
//         this.nextHandler = handler
//         return handler
//     }

//     handle(order: Order) {
//         this.process(order)
//         if (this.nextHandler) {
//             this.nextHandler.handle(order)
//         }
//     }

//     protected abstract process(order: Order): void
// }

// class ValidationHandler extends BaseHandler {
//     public process(order: Order): void {
//         if (order.items.length === 0) {
//             throw new Error('Order has no items')
//         }

//         console.log('validation done!')
//     }
// }

// class PaymentHandler extends BaseHandler {
//     public process(order: Order): void {
//         console.log('payment handled successfully')
//     }
// }

// const validation = new ValidationHandler()
// const payment = new PaymentHandler()

// validation.setNext(payment)

// const order: Order = {
//     id: 101,
//     items: ['Wireless Mouse', 'Keyboard'],
//     paid: true,
//     shipped: false,
// }
// validation.handle(order)
