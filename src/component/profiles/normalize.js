import clone from 'clone';

const normalizeObj = (x) => {
  if (x.value) {
    delete x.value;
  }
  if (x.__id) {
    delete x.__id;
  }
  if (x.__fragments__) {
    delete x.__fragments__;
  }
  return x;
};

export const normalize = (obj) => {
  if (!obj) return obj;
  if (obj instanceof Array) {
    return obj.map(normalizeObj);
  }
  return normalizeObj(clone(obj));
};
