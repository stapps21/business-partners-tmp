import api from '../api/axios.ts'

const LOGIN_URL = '/auth/login';
export const loginService = async (mail: string, password: string) => {
    try {
        return await api.post(LOGIN_URL, { mail, password }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        // return {
        //     accessToken: response.data.accessToken,
        //     firstName: response.data.firstName,
        //     lastName: response.data.lastName,
        //     mail: response.data.mail }
    } catch (e) {
        return null
    }
}