const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getCookieByName: (name) => ipcRenderer.invoke('get-cookie-by-name', name),
    setCookieByName: (cookie) => ipcRenderer.invoke('set-cookie-by-name', cookie),
    deleteCookieByName: (name) => ipcRenderer.invoke('delete-cookie-by-name', name),
    getUsbData: (inputData) => ipcRenderer.invoke('get-usb-data', inputData),
    setUsbData: (inputData) => ipcRenderer.invoke('set-usb-data', inputData),
    checkUsb: () => ipcRenderer.invoke('check-usb')
});