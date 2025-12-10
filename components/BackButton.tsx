import { useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';

type RouterPath = Parameters<ReturnType<typeof useRouter>['push']>[0];

export const BackButton = ({ to, style }: { to?: RouterPath; style?: any }) => {
  const router = useRouter();

  return (
    <IconButton
      icon="arrow-left"
      size={26}
      onPress={() => {
        if (to) {
          router.push(to); 
        } else {
          router.back();
        }
      }}
      style={[style]}
    />
  );
};
