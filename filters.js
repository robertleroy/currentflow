const titlecase = function (value) {
  if (!value) return '';
  value = value.toString().toLowerCase()  ;
   return value.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
};

const decimal = function (value, d=0) {
  if (!value) return '' ;
  value = value * 1;
  return value.toFixed(d);
};
