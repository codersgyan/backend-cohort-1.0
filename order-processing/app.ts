class ShippingCalculatorFactory {
    create(provider: string) {
        let shippingProvider;
        if (provider === 'USPS') {
            shippingProvider = new USPS();
        } else if (provider === 'DHL') {
            shippingProvider = new DHL();
        } else {
            shippingProvider = new IndiaPost();
        }

        return shippingProvider;
    }
}

interface IShippingCalculator {
    calculate(): number;
}

class USPS implements IShippingCalculator {
    calculate() {
        return 100;
    }
}

class DHL implements IShippingCalculator {
    calculate() {
        return 60;
    }
}

class IndiaPost implements IShippingCalculator {
    calculate() {
        return 30;
    }
}

class Order {
    constructor(private shippingCalculator: IShippingCalculator) {}

    processOrder() {
        // USPS, DHL
        // processing logic

        // shipping cost
        const cost = this.shippingCalculator.calculate();
        // let cost = 0;
        // if (provider === 'USPS') {
        //     cost = 100;
        //     // call usps api ->
        // } else if (provider === 'DHL') {
        //     cost = 60;
        // } else {
        //     cost = 30;
        // }

        console.log(`Order is processing and cost is: ${cost}`);
    }
}

const provider: string = 'USPS';
const shippingFactory = new ShippingCalculatorFactory();
const shippingProvider = shippingFactory.create(provider);
const order = new Order(shippingProvider);
order.processOrder();
// interface IStorage {
//     save(cart: any): void;
// }

// class MongoDb implements IStorage {
//     save(cart: any) {
//         console.log('storing in mongodb...');
//     }
// }

// class MySql implements IStorage {
//     // Internally calls mysql database

//     save(cart: any) {
//         console.log('storing the order...');
//     }
// }

// class Order {
//     storage: IStorage;
//     constructor(storage: IStorage) {
//         this.storage = storage;
//     }

//     process(cart: any) {
//         // logic....
//         this.storage.save(cart);
//     }
// }
// class FakeDb implements IStorage {
//     save(cart: any): void {
//         console.log('calling fake db for test purpose');
//     }
// }
// const mysql = new MySql();
// const mongo = new MongoDb();
// const fake = new FakeDb();
// const order = new Order(fake);
// order.process([]);
// class ShippingCalculator {
//     calculate(vals: string[]) {
//         console.log('calculating the shipping cost....');
//     }
// }

// class Order {
//     calculator: any;

//     constructor(calculator: any) {
//         this.calculator = calculator;
//     }

//     processOrder() {
//         // processing the order...
//         console.log('Processing the order....');
//         // calculate the shipping cost

//         this.calculator.calculate(['address', '1.5']);
//     }
// }

// const calculator = new ShippingCalculator();
// const order = new Order(calculator);
// order.processOrder();
