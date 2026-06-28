export interface LoginRequest{
    usuario: string,
    password: string
}

export interface LoginResponse{
    autenticate:boolean,
    sessionId: string,
    loginOn:string
}