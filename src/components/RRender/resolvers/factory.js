import { Icon, Select, Input, Button, Table, Modal,
  message, Popconfirm, DatePicker, Spin } from 'antd';

 import ButtonResolver from './button';
 import InputResolver from './input';
 import SelectResolver from './select';
 import ModalResolver from './modal';
 import DatePickerResolver from './datePicker';
 import TableResolver from './table';
 import FormResolver from './form';
 import ExistedModalResolver from './existedModal';
 import DomResolver from './dom';
 import DateRangeResolver from './dateRange';

export default   {
  create: function(type) {
      var resolver = null;
    if(!type) return resolver;
      switch(type) {
        case 'input': resolver = InputResolver; break;
        case 'select': resolver = SelectResolver; break;
        case 'form': resolver = FormResolver; break;
        case 'button': resolver = ButtonResolver; break;
        case 'modal': resolver = ModalResolver; break;
        case 'table': resolver = TableResolver; break;
        case 'existedModal': resolver = ExistedModalResolver; break;
        case 'datePicker': resolver = DatePickerResolver; break;
        case 'dateRange': resolver = DateRangeResolver; break;
        case 'dom': resolver = DomResolver; break;
        default: break;
      }

      return resolver;
  }
}
