import { faFolder, faPlus, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FooterProps {
  onUserFriendsClick: () => void;
  setShowPinPage: (value: boolean) => void;
  showPinPage: boolean;
  onFolderClick: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onUserFriendsClick,
  setShowPinPage,
  showPinPage,
  onFolderClick,
}) => {
  return (
    <div
      className="md:hidden flex bg-[#fafaf8] w-full p-3 h-full items-center justify-between px-15 text-3xl"
      style={{ boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)" }}
    >
      <FontAwesomeIcon
        icon={faUserFriends}
        className="cursor-pointer"
        onClick={onUserFriendsClick}
      />
      <FontAwesomeIcon
        icon={faPlus}
        className=" text-red-500 cursor-pointer"
        onClick={() => setShowPinPage(!showPinPage)}
      />
      <FontAwesomeIcon 
        icon={faFolder} 
        className="mr-5 cursor-pointer" 
        onClick={onFolderClick}
      />
    </div>
  );
};

export default Footer;
