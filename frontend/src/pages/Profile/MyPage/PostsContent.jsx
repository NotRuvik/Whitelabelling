import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  Grid,
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AllPostsView = ({ onEditClick }) => {
  const posts = [
    {
      id: 1,
      date: "July 7, 2025 at 11:50:57 AM",
      title: "Hope for the Future",
      body: "We recently launched a new community outreach program that helps local families with food, education, and spiritual support. Your continued support makes this possible. Thank you for partnering with us to make a difference!",
      missionary: "Vijeta Mishra",
      imageUrl:
        "https://static.wixstatic.com/media/d10952_3211278c19384e49981523270fa62ee5~mv2.jpg/v1/fill/w_332,h_235,al_c,lg_1,q_80,enc_auto/d10952_3211278c19384e49981523270fa62ee5~mv2.jpg",
    },
    {
      id: 2,
      date: "July 6, 2025 at 3:20:15 PM",
      title: "Summer Youth Camp Highlights",
      body: "Our annual youth camp was a huge success! Over 50 kids joined us for a week of games, learning, and community service. Seeing young lives transformed is what this mission is all about.",
      missionary: "John Doe",
      imageUrl:
        "https://images.unsplash.com/photo-1529243856184-fd5465488984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <Stack spacing={3} alignItems="center">
      {posts.map((post) => (
        <Card
          key={post.id}
          variant="outlined"
          sx={{
            borderRadius: "16px",
            p: 4, // Increased padding
            maxWidth: 900, // Fixed card width
            width: "100%",
          }}
        >
          <Grid container spacing={3} alignItems="stretch">
            {/* Content */}
            <Grid item xs={12} md={7}>
              <Stack
                spacing={2}
                sx={{ height: "100%", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {post.date}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", my: 1 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {post.body}
                  </Typography>
                  <Button
                    variant="text"
                    sx={{
                      p: 0,
                      textTransform: "none",
                      color: "text.primary",
                      mt: 1,
                    }}
                  >
                    Read more
                  </Button>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => onEditClick(post)}
                    sx={{
                      backgroundColor: "#C0A068",
                      color: "white",
                      "&:hover": { backgroundColor: "#a98c5a" },
                      borderRadius: "8px",
                      textTransform: "none",
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#f44336",
                      color: "white",
                      "&:hover": { backgroundColor: "#d32f2f" },
                      borderRadius: "8px",
                      textTransform: "none",
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            {/* Image */}
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={post.imageUrl}
                alt={post.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </Grid>
          </Grid>
        </Card>
      ))}
    </Stack>
  );
};

// --- Sub-component for the "Add New Post" view ---
const AddNewPostView = ({ editPost }) => {
  const [missionary, setMissionary] = useState(editPost?.missionary || "");
  const [title, setTitle] = useState(editPost?.title || "");
  const [body, setBody] = useState(editPost?.body || "");
  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Your Posts are located on your main page and function a lot like a post
        on Social Media sites. This is the way to share news about upcoming or
        past events. The more information you give donors and the more activity
        you show, the more likely donors will want to partner with your cause.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2, // space between the fields
        }}
      >
        {/* Select Field */}
        <Select
          fullWidth
          value={missionary}
          onChange={(e) => setMissionary(e.target.value)}
          displayEmpty
          sx={{
            flex: 1,
            height: 38,
            borderRadius: "12px",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          <MenuItem value="" disabled>
            Select Missionary
          </MenuItem>
          <MenuItem value="Vijeta Mishra">Vijeta Mishra</MenuItem>
          <MenuItem value="John Doe">John Doe</MenuItem>
        </Select>

        <TextField
          fullWidth
          label="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            sx: {
              borderRadius: "12px",
              height: "38px",
              padding: "0 12px",
              "& input": {
                padding: "10px 0",
              },
            },
          }}
        />
      </Box>

      <TextField
        label="Add your post content here."
        multiline
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            height: "150px",
            alignItems: "flex-start",
            "& textarea": {
              padding: "12px",
              height: "100% !important",
              boxSizing: "border-box",
            },
          },
        }}
      />

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{
          alignSelf: "flex-start",
          color: "text.secondary",
          borderColor: "#e0e0e0",
          borderRadius: "12px",
        }}
      >
        Add Images or Videos
      </Button>

      <Box sx={{ textAlign: "center", pt: 2 }}>
        <Button
          variant="outlined"
          sx={{
            color: "#e57373",
            borderColor: "#e57373",
            borderRadius: "20px",
            textTransform: "none",
            px: 4,
            "&:hover": {
              borderColor: "#e57373",
              backgroundColor: "rgba(229, 115, 115, 0.04)",
            },
          }}
        >
          Save Details
        </Button>
      </Box>
    </Stack>
  );
};

// --- Main PostsContent Component ---
const PostsContent = () => {
  const [view, setView] = useState("all");
  const [editPost, setEditPost] = useState(null);
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
      if (newView === "add") {
        setEditPost(null);
      }
    }
  };

  const handleEditClick = (post) => {
    setEditPost(post);
    setView("add");
  };
  return (
    <Stack spacing={3}>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="posts view"
        >
          <ToggleButton
            value="all"
            aria-label="all posts"
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              px: 4,
              border: "1px solid #e0e0e0",
              "&.Mui-selected": {
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
              },
            }}
          >
            All Posts
          </ToggleButton>
          <ToggleButton
            value="add"
            aria-label="add new post"
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              px: 4,
              border: "1px solid #e0e0e0",
              "&.Mui-selected": {
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
              },
            }}
          >
            Add New Post
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Conditionally render the view based on state */}
      {view === "all" ? (
        <AllPostsView onEditClick={handleEditClick} />
      ) : (
        <AddNewPostView editPost={editPost} />
      )}
    </Stack>
  );
};

export default PostsContent;
