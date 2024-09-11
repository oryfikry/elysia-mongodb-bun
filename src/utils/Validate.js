export const Validate = (rules, body) => {
    for (const rule of rules) {
      const [field, condition] = rule.split('|');
      const [key, value] = condition.split(':');
      
      if (key === 'required' && value === 'true' && !body[field]) {
        return { valid: false, message: `The ${field} field is required.` };
      }
    }
    return { valid: true };
  };
  