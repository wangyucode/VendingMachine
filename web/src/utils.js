export function getCartGoodsCount(cartGoods) {
  let count = 0;
  cartGoods.forEach((c) => (count += c.count));
  return count > 0 ? count : null;
}

export function getTotalPrice(cartGoods) {
    let total = 0;
    cartGoods.forEach((c) => (total += c.goods.price * c.count));
    return total;
  }
