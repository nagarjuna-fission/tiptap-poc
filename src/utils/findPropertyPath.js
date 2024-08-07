export const findPropertyPath = (data, property, propertyPath = { found: false, path: [] }, depth = 5, currentDepth = 0) => {
    console.log("in findPropertyPath", depth, currentDepth);
    if (currentDepth > depth || data === null || typeof data !== 'object') {
      return null;
    }

    const keys = Object.keys(data);
    for (const key of keys) {
        propertyPath.path.push(key);
        if (key === property) {
            console.log(propertyPath.path);
        }
        if (typeof data[key] === 'object') {
            findPropertyPath(data[key], property, propertyPath, depth, currentDepth + 1);
        }
        propertyPath.path.pop();
    }
  
    return null;
  };
  