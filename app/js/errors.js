// классы ошибок

class ValidationError extends Error {
    name = this.constructor.name;
} 

class InvalidNameError extends ValidationError {
    name = this.constructor.name;
}

class InvalidNumError extends ValidationError {
    name = this.constructor.name;
}