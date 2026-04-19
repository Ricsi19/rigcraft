export function computeConfigurationTotal(items, componentMap) {
  return (items || []).reduce((sum, item) => {
    const component = componentMap.get(Number(item.component_id));
    if (!component) {
      return sum;
    }
    return sum + component.price_huf * Number(item.quantity || 0);
  }, 0);
}
