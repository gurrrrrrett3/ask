import express from "express"

declare global {
    namespace express {
        type Request = {
            id: string
        }
    }
}
