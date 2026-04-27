// Validaciones reutilizables para toda la app

export const validators = {
  email: (value) => {
    if (!value) return "El correo es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Correo inválido";
    return null;
  },

  password: (value) => {
    if (!value) return "La contraseña es requerida";
    if (value.length < 4) return "La contraseña debe tener al menos 4 caracteres";
    return null;
  },

  name: (value) => {
    if (!value) return "El nombre es requerido";
    if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
    return null;
  },

  parkingName: (value) => {
    if (!value) return "El nombre del parqueo es requerido";
    if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
    return null;
  },

  capacity: (value) => {
    if (!value) return "La capacidad es requerida";
    const num = parseInt(value);
    if (isNaN(num) || num <= 0) return "La capacidad debe ser un número mayor a 0";
    if (num > 1000) return "La capacidad no puede exceder 1000 espacios";
    return null;
  },

  price: (value) => {
    if (!value) return "La tarifa es requerida";
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return "La tarifa debe ser un número válido";
    if (num > 50000) return "La tarifa no puede exceder ₡50,000";
    return null;
  },

  latitude: (value) => {
    if (!value) return "La latitud es requerida";
    const num = parseFloat(value);
    if (isNaN(num) || num < -90 || num > 90) return "Latitud inválida (-90 a 90)";
    return null;
  },

  longitude: (value) => {
    if (!value) return "La longitud es requerida";
    const num = parseFloat(value);
    if (isNaN(num) || num < -180 || num > 180) return "Longitud inválida (-180 a 180)";
    return null;
  },

  availableSpots: (value, capacity) => {
    if (!value) return "Los espacios disponibles son requeridos";
    const num = parseInt(value);
    if (isNaN(num) || num < 0) return "Debe ser un número válido";
    if (capacity && num > parseInt(capacity)) {
      return "No puede exceder la capacidad total";
    }
    return null;
  }
};

// Validar un formulario completo
export function validateForm(form, schema) {
  const errors = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const error = rules(form[field], form);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// Verificar si un email ya existe
export function isEmailUnique(email, users) {
  return !users.some(u => u.email.toLowerCase() === email.toLowerCase());
}

// Obtener todos los errores
export function getFormErrors(form, schema, additionalErrors = {}) {
  const validationErrors = validateForm(form, schema);
  return { ...validationErrors, ...additionalErrors };
}
