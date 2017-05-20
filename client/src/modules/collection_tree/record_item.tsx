import React from 'react';
import HttpMethodIcon from '../../components/font_icon/http_method_icon';
import ItemWithMenu from '../../components/item_with_menu';
import './style/index.less';
import { Menu, Icon } from 'antd';
import { deleteDlg } from '../../components/confirm_dialog/index';
import { DtoRecord } from '../../../../api/interfaces/dto_record';

interface RecordItemProps {
    record: DtoRecord;

    inFolder: boolean;

    deleteRecord();

    duplicateRecord();

    moveRecordToFolder(record: DtoRecord, collectionId?: string, folderId?: string);

    moveToCollection(record: DtoRecord, collection?: string);
}

interface RecordItemState {
}

class RecordItem extends React.Component<RecordItemProps, RecordItemState> {

    itemWithMenu: ItemWithMenu;

    constructor(props: RecordItemProps) {
        super(props);
    }

    getMenu = () => {
        return (
            <Menu className="item_menu" onClick={this.onClickMenu}>
                <Menu.Item key="duplicate">
                    <Icon type="copy" /> Duplicate
                </Menu.Item>
                <Menu.Item key="delete">
                    <Icon type="delete" /> Delete
                </Menu.Item>
            </Menu>
        );
    }

    onClickMenu = (e) => {
        this[e.key]();
    }

    delete = () => deleteDlg('record', () => this.props.deleteRecord());

    duplicate = () => this.props.duplicateRecord();

    checkTransferFlag = (e, flag) => {
        return e.dataTransfer.types.indexOf(flag) > -1;
    }

    dragStart = (e) => {
        e.dataTransfer.setData('record', JSON.stringify(this.props.record));
    }

    dragOver = (e) => {
        e.preventDefault();
    }

    drop = (e) => {
        const currentRecord = this.props.record;
        if (this.checkTransferFlag(e, 'record')) {
            const transferRecord = JSON.parse(e.dataTransfer.getData('record')) as DtoRecord;
            if (transferRecord.pid !== currentRecord.pid || transferRecord.collectionId !== currentRecord.collectionId) {
                this.props.moveRecordToFolder(transferRecord, currentRecord.collectionId, currentRecord.pid);
            }
        } else if (this.checkTransferFlag(e, 'folder')) {
            const folder = JSON.parse(e.dataTransfer.getData('folder')) as DtoRecord;
            if (folder.collectionId !== currentRecord.collectionId) {
                this.props.moveToCollection(folder, currentRecord.collectionId);
            }
        }
    }

    public render() {
        let { record, inFolder } = this.props;
        let { method, name } = record;
        method = method || 'GET';

        return (
            <div draggable={true} onDragStart={this.dragStart} onDragOver={this.dragOver} onDrop={this.drop}>
                <ItemWithMenu
                    ref={ele => this.itemWithMenu = ele}
                    className="record"
                    icon={(
                        <span className={'record-icon' + (inFolder ? ' record-in-folder' : '')}>
                            <HttpMethodIcon httpMethod={method.toUpperCase()} />
                        </span>
                    )}
                    name={name}
                    menu={this.getMenu()}
                />
            </div>
        );
    }
}

export default RecordItem;