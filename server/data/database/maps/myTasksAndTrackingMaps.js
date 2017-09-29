
export const myTasksMap = data =>
  data.map(entity => ({
    id: entity.attachRevision.id,
    label: entity.attachRevision.label,
    state: entity.state,
  }));

export const myTrackingMap = data =>
  data.map(entity => ({
    id: entity.id,
    label: entity.label,
  }));
