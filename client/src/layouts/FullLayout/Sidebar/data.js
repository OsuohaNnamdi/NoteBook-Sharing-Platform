import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import SwitchCameraOutlinedIcon from '@mui/icons-material/SwitchCameraOutlined';
import SwitchLeftOutlinedIcon from '@mui/icons-material/SwitchLeftOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';

const Menuitems = {
  student: [
    { title: "Dashboard", icon: DashboardOutlinedIcon, href: "/dashboard" },
    { title: "Send File", icon: AddToPhotosOutlinedIcon, href: "/add-pastquestion" },
    { title: "Send To Friend", icon: AspectRatioOutlinedIcon, href: "/search" },
    { title: "About", icon: AssignmentTurnedInOutlinedIcon, href: "/home" },
  ],
  lecturer: [
    { title: "Dashboard", icon: SwitchLeftOutlinedIcon, href: "/lecturer-dashboard" },
    { title: "Add Course", icon: SwitchCameraOutlinedIcon, href: "/add-course" },
    { title: "About", icon: AlbumOutlinedIcon, href: "/home" },
  ],
  guest: [
    { title: "Login", icon: DescriptionOutlinedIcon, href: "/login" },
    { title: "Register", icon: AutoAwesomeMosaicOutlinedIcon, href: "/register" },
  ],
};

export default Menuitems;
