import { createSlice } from '@reduxjs/toolkit'
import { doNotExits } from '@utils'

const initialState = {
  accessToken: "",
  remember: true,
  email: "",
  password: "",
  "idTangKhNcc": 0,
  "maKh": "",
  "tenKh": "",
  "diaChi": null,
  "loaiKhach": 0
}

// Create Redux state slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateToken: (state, action) => {
      for (const key in action.payload) {
        state[key] = action.payload[key] || state[key]
      }
    },
    removeToken: (state) => {
      state = initialState
    }
  },
})

export const { updateToken, removeToken } = authSlice.actions
export default authReducer = authSlice.reducer