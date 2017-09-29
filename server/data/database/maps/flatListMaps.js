
const nullLabel = '* null *';

export const flatListMap = data =>
  data.map(entity => ({
    id: entity.id,
    familyId: entity.familyId,
    label: entity.label || nullLabel,
    entityType: entity.entityType,
    indent: 1,
  }));
