class BaseFormController extends BaseController{
    constructor(secured) {
        super(secured);
    }
    valideRequiredField(selector,name){
        const value =  $(selector).value
        if ((value == null) || (value.trim() === "")) {
            this.toast(`Le champs '${name}' est obligatoire`)
            $(selector).style.border = '2px solid #fc3754'
            return null
        }
        return value
    }
}