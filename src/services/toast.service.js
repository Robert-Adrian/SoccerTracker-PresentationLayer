export const showSuccessWithMessage = (toast, message) => {
    toast.current.show({severity: 'success', summary: 'Success', detail: message, life: 3000});
}

export const showInfoWithMessage = (toast, message) => {
    toast.current.show({severity: 'info', summary: 'Info', detail: message, life: 3000});
}

export const showWarnWithMessage = (toast, message) => {
    toast.current.show({severity: 'warn', summary: 'Avertisment', detail: message, life: 3000});
}

export const showErrorWithMessage = (toast, message) => {
    toast.current.show({severity: 'error', summary: 'Eroare', detail: message, life: 3000});
}

export const showSuccess = (toast) => {
    toast.current.show({severity: 'success', summary: 'Success', detail: 'Operatiune efectuata cu succes!', life: 3000});
}

export const showError = (toast) => {
    toast.current.show({severity: 'error', summary: 'Eroare', detail: 'A aparut o eroare! Incercati din nou.', life: 3000});
}


