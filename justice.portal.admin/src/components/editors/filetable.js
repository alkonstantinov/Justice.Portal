import React from 'react';
import BaseComponent from '../basecomponent';
import uuidv4 from 'uuid/v4';
import Comm from '../../modules/comm';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class FileTable extends BaseComponent {

    constructor(props) {
        super(props);
        this.AddRow = this.AddRow.bind(this);
        this.DeleteRow = this.DeleteRow.bind(this);


    }
    componentDidMount() {
        var self = this;
        // Comm.Instance().get('part/GetPKLabels?group=ft')
        //     .then(result => {
        //         self.setState({ fileTypes: result.data });
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.status === 401)
        //             toast.error("Липса на права", {
        //                 onClose: this.Logout
        //             });
        //         else
        //             toast.error(error.message);

        //     });
    }

    AddRow() {
        var files = this.props.files;
        files.push({
            id: uuidv4(),
            title: {},
            fileType: {},
            date: moment().format("YYYY-MM-DD"),
            file: null
        });
        this.props.setRows('files', files);
    }

    DeleteRow(id) {
        var files = this.props.files;
        var toDel = files.find(x => x.id === id);
        var i = files.indexOf(toDel);
        files.splice(i, 1);
        this.props.setRows('files', files);
    }

    // shouldComponentUpdate(nextProps, nextState) {

    //     var result = nextProps.lang !== this.lang;
    //     this.lang = nextProps.lang;
    //     return result;
    // }


    render() {
        var self = this;
        return (
            [
                <div className="row">
                    <div className="col-2">
                        <button className="btn btn-primary" onClick={self.AddRow}>+</button>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-12">
                        {
                            self.props.files.map(x =>
                                <div className="row" key={x.id}>
                                    <div className="col-6">
                                        <label className="control-label">Заглавие</label>
                                        <input className="form-control" value={x.title[self.props.lang] || ""} onChange={(e) => {
                                            var files = self.props.files;
                                            var row = files.find(r => r.id === x.id);
                                            row.title[self.props.lang] = e.target.value;
                                            self.props.setRows('files', files)
                                        }}></input>
                                    </div>
                                    <div className="col-4">
                                        <label className="control-label">Дата</label>
                                        <Calendar dateFormat="dd.mm.yy" value={moment(x.date, "YYYY-MM-DD").toDate()}
                                            onChange={(e) => {
                                                var files = self.props.files;
                                                var row = files.find(r => r.id === x.id);
                                                row.date = moment(e.value).format("YYYY-MM-DD");
                                                self.props.setRows('files', files);

                                            }}
                                            readOnlyInput="true" inputClassName="form-control"></Calendar>

                                    </div>

                                    <div className="col-1">
                                        <label className="control-label">Файл</label>
                                        <input type="text" className="form-control" readOnly="true" value={x.file || ""}
                                            onClick={() =>
                                                self.UploadBlob((blobId) => {
                                                    var files = self.props.files;
                                                    var row = files.find(r => r.id === x.id);
                                                    row.file = blobId;
                                                    self.props.setRows('files', files)
                                                })}></input>

                                    </div>
                                    <div className="col-1">
                                        <button className="btn btn-danger" onClick={() => self.DeleteRow(x.id)}>-</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            ]
        );
    }




}