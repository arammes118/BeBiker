import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import logo from '../../assets/img/BeBiker.png'
import '../../assets/css/post.css'
import { useState } from 'react';
import { Box, Grid } from '@mui/material';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Post = () => {
    const [expanded, setExpanded] = useState(false)
    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(!active);
    };


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345, minWidth:345 }}>
            <CardHeader
                avatar={
                    <Avatar src={logo} />
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={<span style={{ fontWeight: 'bold' }}>_aramirezmes03_</span>}
            />
            <CardMedia
                component="img"
                height="200"
                image={logo}
                alt="Paella dish"
            />
            <CardActions disableSpacing>
                <IconButton
                    aria-label="Me gusta"
                    onClick={handleClick}
                    className={active ? 'active' : ''}
                >
                    <FavoriteIcon className={active ? 'activeIcon' : ''} />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>

            <CardContent>
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" component="span" fontWeight="bold" marginRight={1}>
                        _aramirezmes03_
                    </Typography>
                    <Typography variant="body1">
                        BeBiker
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default Post