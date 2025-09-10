
export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  return `lunch_${timestamp}_${randomString}`;
}

export function generateUUIDLikeId(): string {
  const timestamp = Date.now().toString(16);
  const random1 = Math.random().toString(16).substring(2, 6);
  const random2 = Math.random().toString(16).substring(2, 6);
  const random3 = Math.random().toString(16).substring(2, 6);
  const random4 = Math.random().toString(16).substring(2, 6);
  
  return `${timestamp}-${random1}-${random2}-${random3}-${random4}`;
}
