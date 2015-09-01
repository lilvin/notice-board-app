import AppDispatcher from '../dispatcher/AppDispatcher'
import ActionTypes from '../constants/ActionTypes'
import { EventEmitter } from 'events'
import Scheduler from '../util/Scheduler'
import Sync from '../util/Sync'
// selected index of selected college
// selectedDepartment index of selected Department
// selectedSem selected Semseter
let data = {
  notices: []
}

let wareHouse = {
  notices: []
}

class NoticeStore extends EventEmitter {
  getState () {
    return data;
  }

  emitChange () {
    this.emit('CHANGE');
  }

  addChangeListener (cb) {
    this.on('CHANGE', cb);
  }

  removeChangeListener (cb) {
    this.removeListener(cb);
  }
}

let _NoticeStore = new NoticeStore();

export default _NoticeStore;

let filterNotice =  () => {
  data.notices = wareHouse.notices.filter((notice) => {
    console.log("Notice", notice);
    if(notice.type === "image" || notice.type === "video") {
      Sync.getStaticFiles(notice.path, notice.type)
    }

    return Scheduler.valid(notice.startTime, notice.endTime);
  })
}

AppDispatcher.register(function(payload) {
  var action = payload.action;
  console.log('Action received', action.type);
  switch (action.type) {
    case ActionTypes.FETCH_NOTICES:
      wareHouse.notices = action.data;

      Scheduler.schedule(wareHouse.notices);
      filterNotice();

      _NoticeStore.emitChange();
      break;

    case ActionTypes.RELOAD_NOTICES:
      filterNotice();
      _NoticeStore.emitChange();

    default:

  }


})
