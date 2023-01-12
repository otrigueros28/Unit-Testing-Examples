export const formatSelectOptions = (items, label = 'name') => {
  if (!Array.isArray(items)) return [];

  return items.reduce((options, item) => {
    let formattedOption;

    if (item[label]) {
      formattedOption = {
        label: item[label],
        value: item.id,
      };
    } else {
      formattedOption = {
        label: item.id,
        value: item.id,
      };
    }

    options.push(formattedOption);

    return options;
  }, []);
};

export const getSelectOptions = items => {
  const options = [];

  if (!items || items.length === 0) {
    return options;
  }

  items.forEach(item => {
    const {
      name,
      id,
    } = item;

    options.push({
      value: id,
      label: name,
    });
  });

  return options;
};
