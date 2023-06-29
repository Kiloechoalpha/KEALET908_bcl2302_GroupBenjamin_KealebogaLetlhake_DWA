const provinces = ['Western Cape', 'Gauteng', 'Northern Cape', 'Eastern Cape', 'KwaZulu-Natal', 'Free State'];
const names = ['Ashwin', 'Sibongile', 'Jan-Hendrik', 'Sifso', 'Shailen', 'Frikkie'];

// Exercise 1
names.forEach(name => {
  console.log(name);
});

// Exercise 2
names.forEach((name, index) => {
  console.log(`${name} (${provinces[index]})`);
});

// Exercise 3
const uppercaseProvinces = provinces.map(province => province.toUpperCase());
console.log(uppercaseProvinces);

// Exercise 4
const nameLengths = names.map(name => name.length);
console.log(nameLengths);

// Exercise 5
const sortedProvinces = provinces.sort();
console.log(sortedProvinces);

// Exercise 6
const filteredProvinces = provinces.filter(province => !province.includes('Cape'));
console.log(filteredProvinces.length);

// Exercise 7
const hasSCharacter = names.map(name => name.includes('S'));
console.log(hasSCharacter);

// Exercise 8
const provinceObject = names.reduce((obj, name, index) => {
  obj[name] = provinces[index];
  return obj;
}, {});
console.log(provinceObject);

// Additional exercises

const products = [
  { product: 'banana', price: "2" },
  { product: 'mango', price: 6 },
  { product: 'potato', price: ' ' },
  { product: 'avocado', price: "8" },
  { product: 'coffee', price: 10 },
  { product: 'tea', price: '' },
];

// Exercise 1
products.forEach(product => {
  console.log(product.product);
});

// Exercise 2
const filteredProducts = products.filter(product => product.product.length <= 5);
console.log(filteredProducts);

// Exercise 3
const totalPrice = products
  .filter(product => typeof product.price === 'number' && product.price !== '')
  .map(product => Number(product.price))
  .reduce((total, price) => total + price, 0);
console.log(totalPrice);

// Exercise 4
const productNames = products.reduce((str, product) => {
  if (str === '') {
    return product.product;
  } else {
    return `${str}, ${product.product}`;
  }
}, '');
console.log(productNames);

// Exercise 5
const highestLowestPrices = products.reduce((result, product) => {
  if (result.highest === null || product.price > result.highest.price) {
    result.highest = product;
  }
  if (result.lowest === null || product.price < result.lowest.price) {
    result.lowest = product;
  }
  return result;
}, { highest: null, lowest: null });
console.log(`Highest: ${highestLowestPrices.highest.product}. Lowest: ${highestLowestPrices.lowest.product}`);

// Exercise 6
const recreatedObject = Object.entries(products).reduce((obj, [key, value]) => {
  const { product, price } = value;
  obj[key] = { name: product, cost: price };
  return obj;
}, {});
console.log(recreatedObject);