import { validate as isUuid } from "uuid";
import validator from 'validator'

export class Validator {
    static required(value: unknown, field: string): string | null {
        if (value === null || value === undefined) {
            return `${field} é obrigatório.`
        }

        if (typeof value === 'string' && value.trim() === '') {
            return `${field} é obrigatório.`
        }

        return null
    }

    static length(value: unknown, min: number | '', max: number | '', field: string): string[] | null {
        if (value === null || value === undefined) {
            return [`${field} é obrigatório.`]
        }

        if (typeof value !== 'string') {
            return [`${field} deve ser um texto válido.`]
        }

        const erros: string[] = []
        if (typeof min === "number" && value.length < min) {
            erros.push(`${field} deve possuir no mínimo ${min} caracteres.`)
        }
        if (typeof max === "number" && value.length > max) {
            erros.push(`${field} deve possuir no máximo ${max} caracteres.`)
        }
        if (erros.length > 0) {
            return [...erros]
        }
        return null
    }

    static equals(value1: unknown, value2: unknown, message: string): string | null {
        if (value1 !== value2) {
            return message
        }
        return null
    }

    static email(email: unknown): string | null {
        if (typeof email !== 'string' || email.trim() === '') {
            return null
        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {
            return "E-mail inválido."
        }
        return null
    }

    static isEmail(email: unknown): boolean {
        return typeof email === 'string' && validator.isEmail(email);
    }

    static isUUUID(id: unknown): boolean {
        return typeof id === 'string' && isUuid(id)
    }

    static isDate(value: unknown, field: string): string | null {
        if (typeof value !== 'string' || value.trim() === '') {
            return `${field} é obrigatório.`;
        }

        if (!validator.isDate(value, {
            format: "YYYY-MM-DD",
            strictMode: true
        })) {
            return `${field} deve ser uma data válida.`;
        }

        return null;
    }
}