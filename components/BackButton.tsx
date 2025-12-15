import { setSearch } from '@/store/ProductsSlice';
import { useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';

type RouterPath = Parameters<ReturnType<typeof useRouter>['push']>[0];

export const BackButton = ({ to, style }: { to?: RouterPath; style?: any }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setSearch(''));
    if (to) {
          router.push(to); 
        } else {
          router.back();
    }
  }

  return (
    <IconButton
      icon="arrow-left"
      size={26}
      onPress={() => handleBack()}
      style={[style]}
    />
  );
};