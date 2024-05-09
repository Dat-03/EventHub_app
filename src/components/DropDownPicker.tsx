import {ArrowDown2, SearchNormal1} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ButtonCT, InputCT, RowCT, SpaceCT, TextCT} from '.';
import {fontFamilies} from '../constants/FontFamilies';
import {appColors} from '../constants/themeColor';
import {SelectModel} from '../models/SelectModel';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  label?: string;
  values: SelectModel[];
  selected?: string | string[];
  onSelect: (val: string | string[]) => void;
  multible?: boolean;
}

const DropdownPicker = (props: Props) => {
  const {onSelect, selected, values, label, multible} = props;
  const [searchKey, setSearchKey] = useState('');
  const [isVisibleModalize, setIsVisibleModalize] = useState(false);
  const modalieRef = useRef<Modalize>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (isVisibleModalize) {
      modalieRef.current?.open();
    }
  }, [isVisibleModalize]);

  useEffect(() => {
    if (isVisibleModalize && selected) {
      setSelectedItems(multible ? (selected as string[]) : []);
    }
  }, [isVisibleModalize, selected, multible]);

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      const data = [...selectedItems];

      const index = selectedItems.findIndex(element => element === id);

      if (index !== -1) {
        data.splice(index, 1);
      }

      setSelectedItems(data);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderSelectedItem = (id: string) => {
    const item = values.find(element => element.value === id);

    return item ? (
      <RowCT key={id} styles={[localStyles.selectedItem]}>
        <TextCT
          text={`${
            item.label.includes('@') ? item.label.split('@')[0] : item.label
          }`}
          color={appColors.primary}
        />
        <SpaceCT width={8} />
        <TouchableOpacity
          onPress={() => {
            handleSelectItem(id);
            onSelect(selectedItems);
          }}>
          <AntDesign name="close" size={18} color={appColors.text} />
        </TouchableOpacity>
      </RowCT>
    ) : (
      <></>
    );
  };

  const renderSelectItem = (item: SelectModel) => {
    return (
      <RowCT
        onPress={
          multible
            ? () => handleSelectItem(item.value)
            : () => {
                onSelect(item.value);
                modalieRef.current?.close();
              }
        }
        key={item.value}
        styles={[localStyles.listItem]}>
        <TextCT
          text={item.label}
          flex={1}
          font={
            selectedItems?.includes(item.value)
              ? fontFamilies.medium
              : fontFamilies.regular
          }
          color={
            selectedItems?.includes(item.value)
              ? appColors.primary
              : appColors.text
          }
        />
        {selectedItems.includes(item.value) && (
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            size={22}
            color={appColors.primary}
          />
        )}
      </RowCT>
    );
  };

  return (
    <View style={{marginBottom: 8}}>
      {label && <TextCT text={label} styles={{marginBottom: 8}} />}
      <RowCT
        styles={[globalStyles.inputContainer, {alignItems: 'flex-start'}]}
        onPress={() => setIsVisibleModalize(true)}>
        <RowCT styles={{flex: 1, flexWrap: 'wrap'}}>
          {selected ? (
            selectedItems.length > 0 ? (
              selectedItems.map(item => renderSelectedItem(item))
            ) : (
              <TextCT
                text={
                  values.find(element => element.value === selected)?.label ??
                  ''
                }
              />
            )
          ) : (
            <TextCT text="Select" />
          )}
        </RowCT>
        <ArrowDown2 size={22} color={appColors.gray} />
      </RowCT>
      <Portal>
        <Modalize
          handlePosition="inside"
          ref={modalieRef}
          FooterComponent={
            multible && (
              <View style={{paddingHorizontal: 20, paddingBottom: 30}}>
                <ButtonCT
                  text="Agree"
                  type="primary"
                  onPress={() => {
                    onSelect(selectedItems);
                    modalieRef.current?.close();
                  }}
                />
              </View>
            )
          }
          scrollViewProps={{showsVerticalScrollIndicator: false}}
          HeaderComponent={
            <RowCT
              styles={{
                marginBottom: 12,
                paddingHorizontal: 20,
                paddingTop: 30,
              }}>
              <View style={{flex: 1}}>
                <InputCT
                  styles={{marginBottom: 0}}
                  placeholder="Search..."
                  value={searchKey}
                  onChange={val => setSearchKey(val)}
                  allowClear
                  affix={<SearchNormal1 size={22} color={appColors.text} />}
                />
              </View>
              <SpaceCT width={20} />
              <ButtonCT
                type="link"
                text="Cancel"
                onPress={() => modalieRef.current?.close()}
              />
            </RowCT>
          }
          onClose={() => setIsVisibleModalize(false)}>
          <View style={{paddingHorizontal: 20, paddingVertical: 30}}>
            {values.map(item => renderSelectItem(item))}
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default DropdownPicker;

const localStyles = StyleSheet.create({
  listItem: {
    marginBottom: 20,
  },
  selectedItem: {
    borderWidth: 0.5,
    borderColor: appColors.primary,
    padding: 4,
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 8,
  },
});
