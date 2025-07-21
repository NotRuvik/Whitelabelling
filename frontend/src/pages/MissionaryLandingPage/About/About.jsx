import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DonationCard from "../Home/DonationCard";

export default function AboutMissionaryLanding() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box sx={{ bgcolor: "#fff", margin: "0", fontFamily: "Arial, sans-serif" }}>
      {/* Header Section */}
      <Box
  sx={{
    // px: { xs: 3, md: 2 }, // Increased padding for larger width
    // py: 3, // Increased vertical padding for taller height
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    // alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1000px", // Set to match target screen width
    height: "auto", // Allow height to adjust naturally
    // minHeight: "1200px", // Ensure it utilizes the full height
    mx: "auto",
    boxSizing: "border-box",
  }}
>
  <Box sx={{ textAlign: "left", flex: 1, pr: { md: 6 } }}>
    <Typography
      variant="h3"
      sx={{
        fontWeight: "bold",
        mt: 6,
        mb: 3,
        fontFamily: "Impact, sans-serif",
        color: "#000",
        fontSize: { xs: "2.5rem", md: "3.5rem" }, // Increased font size for larger layout
      }}
    >
      Dream with Night Bright ✨
    </Typography>
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{
        fontSize: { xs: "1.1rem", md: "1.3rem" }, // Increased font size
        lineHeight: 1.6,
        mb: 3,
      }}
    >
      We strive to make donating to your favorite causes an enjoyable experience
      that leads to a deeper connection with the thousands of beautiful people
      spreading the love of God throughout the globe. Please join us in making it
      easier to find, fund, and resource missions worldwide.
    </Typography>
  </Box>
  <Box
    sx={{
      textAlign: "center",
      flex: 1,
      maxWidth: { xs: "100%", md: "1000px" }, // Increased width for video
      mt: { xs: 5, md: 10 },
    }}
  >
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        paddingTop: "56.25%", // Maintain 16:9 aspect ratio
        width: "100%",
        maxWidth: "1000px", // Increased to utilize more space
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        height: "auto",
        // maxHeight: "600px", // Increased height for larger video
      }}
    >
      <iframe
        src="https://www.youtube.com/embed/pY1Es85hbjk"
        title="Night Bright Summary"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </Box>
  </Box>
</Box>

      {/* Features Section */}
      <Box
        sx={{
          py: 10,
          display: "flex",
          justifyContent: "space-around",
          mb: 6,
          px: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 4,
            bgcolor: "#fff",
            width: { xs: "100%", md: "22%" },
            m: 1,
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          <Typography variant="h6" color="#000" gutterBottom>
            CHRIST CENTERED
          </Typography>
          <Typography variant="body2" color="#666">
            We believe Jesus is the only way to God. Therefore, our platform
            only supports those with a similar heart and theology. For more on
            our beliefs, see below.
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 4,
            bgcolor: "#fff",
            width: { xs: "100%", md: "22%" },
            m: 1,
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
            minHeight: "300px",
          }}
        >
          <Typography variant="h6" color="#000" gutterBottom>
            FREE TO USE
          </Typography>
          <Typography variant="body2" color="#666">
            We strive and promise to make our services 100% donation based,
            which keeps our platform and services free to use by the
            missionaries we serve.
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 4,
            bgcolor: "#fff",
            width: { xs: "100%", md: "22%" },
            m: 1,
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          <Typography variant="h6" color="#000" gutterBottom>
            VERIFICATION
          </Typography>
          <Typography variant="body2" color="#666">
            Night Bright has steps in place to authenticate the validity of our
            missionaries. To find out more, look at our FAQ answer at the bottom
            of the page.
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 4,
            bgcolor: "#fff",
            width: { xs: "100%", md: "22%" },
            m: 1,
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          <Typography variant="h6" color="#000" gutterBottom>
            COVERING
          </Typography>
          <Typography variant="body2" color="#666">
            Night Bright is not a covering for missionaries and we only accept
            ones that are under the covering of a church. We bring light to the
            missional work of churches.
          </Typography>
        </Box>
      </Box>

      {/* Statement of Faith Section */}
      <Box sx={{ mb: 6, px: 2, textAlign: "center" }}>
        <Typography
          variant="h4"
          color="#000"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Statement of Faith
        </Typography>
        <Typography
          variant="body2"
          color="#666"
          sx={{ maxWidth: "800px", mx: "auto", textAlign: "left" }}
        >
          Our platform was designed to support and empower Christian
          missionaries to spread the Gospel to the remotest parts of the world.
          While we ask that all missionaries adhere to the essential core
          beliefs of Christianity (as defined below), we do not base access to
          our platform on denominational differences. We recognize that
          Christians may hold varying interpretations of some doctrine, but our
          focus remains on supporting the mission to share the hope of Jesus
          Christ.
          <br />
          <br />
          ✝ We believe the Bible to be God’s inspired, infallible, and
          authoritative Word. All scripture is useful for teaching, rebuking,
          correcting, and training in righteousness (2 Timothy 3:16).
          <br />
          <br />
          ✨ We believe in one God eternally existing in three persons: Father,
          Son, and Holy Spirit.
          <br />
          <br />
          ★ We believe in the deity of our Lord Jesus Christ, His virgin birth,
          His sinless life, His miracles, His vicarious and atoning death
          through His shed blood, His bodily resurrection, His ascension to the
          right hand of the Father, and His personal return in power and glory.
          <br />
          <br />
          ⚡ We believe Jesus is the only way to God; salvation is a gift from
          God and is only received through faith in Jesus Christ.
          <br />
          <br />
          We believe the Gospel is the good news of Jesus Christ’s death and
          resurrection for the forgiveness of sins. It proclaims that through
          faith in Jesus, anyone can receive salvation and be reconciled to God,
          not by works but by grace alone. The Gospel message offers eternal
          life to those who believe, transforming their lives with hope and the
          promise of God’s Kingdom.
        </Typography>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          maxWidth: "100%",
          mx: "auto",
          p: 4,
          minHeight: "400px",
        }}
      >
        <DonationCard />
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 15, px: 2, bgcolor: "#1a1a1a", py: 4 }}>
        <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto" }}>
          <Typography
            variant="h4"
            color="#fff"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            FAQ
          </Typography>
          <FAQItemMissionaryLanding
            question="ARE THERE HIDDEN FEES? IS THE PLATFORM 100% FREE?"
            index={0}
            openIndex={openIndex}
            handleClick={handleClick}
            answer={
              <>
                No. Every dollar you donate goes entirely to the missionary or
                missional cause you choose to support. We even require donors to
                cover the fees if they choose to donate with their credit card.
                <br />
                <br />
                Night Bright covers its operating costs through the generosity
                of individual and corporate donors like you. One key way you can
                help is by adding a 'tip' for Night Bright when making a
                donation to your favorite missionary.
              </>
            }
          />
          <FAQItemMissionaryLanding
            question="AS A MISSIONARY DO I HAVE TO USE MY REAL NAME AND COUNTRY?"
            index={1}
            openIndex={openIndex}
            handleClick={handleClick}
            answer={
              <>
                The simple answer is no.
                <br />
                <br />
                We fully recognize that many missionaries serve in regions where
                it is dangerous or hostile toward Christians. Your safety is our
                top priority, and we have implemented measures to protect your
                identity and location.
                <br />
                <br />
                To ensure your security, we do not require you to disclose the
                specific country you are working in. Instead, you can simply
                indicate the continent where your mission is based.
                Additionally, you are welcome to use pseudonyms on our platform.
                The only time we ask for your real name is during the sign-up
                process, where we use it for verification purposes. We will
                cross-reference your identity with a government-issued ID, such
                as a driver’s license, but this information will not be made
                public.
                <br />
                <br />
                We are also developing additional security features, including
                IP blockers, to prevent individuals in countries hostile to
                Christianity from accessing and searching our site. This is just
                one of the ways we’re working to safeguard those serving in
                sensitive areas.
                <br />
                <br />
                That said, we understand that each missionary’s situation is
                unique, and we encourage you to prayerfully consider whether
                Night Bright is the right platform for you. While we strive to
                provide a secure space for missionaries to connect with
                financial and missional support, we know our platform may not be
                suitable for everyone.
                <br />
                <br />
                Ultimately, our goal is to support you in your work by providing
                a safe, reliable way to connect with donors and receive the
                resources you need.
              </>
            }
          />
          <FAQItemMissionaryLanding
            question="HOW DO YOU PREVENT FRAUD/VERIFY MISSIONARIES?"
            index={2}
            openIndex={openIndex}
            handle
            Steph={handleClick}
            answer={
              <>
                We understand that fraud can be a concern when using any online
                giving platform, and we take that very seriously. At Night
                Bright, we are committed to doing everything possible to prevent
                fraudulent activity and to ensure the safety and trustworthiness
                of our platform.
                <br />
                <br />
                To protect both donors and missionaries, we have implemented a
                comprehensive set of security measures. On the backend, we
                require every missionary to submit government-issued
                identification, ensuring we can accurately verify their
                identity. Additionally, all bank accounts must be directly
                connected to our platform through a secure third-party system,
                adding another layer of protection to prevent any unauthorized
                or fraudulent transactions.
                <br />
                <br />
                Beyond these basic safeguards, we have several other
                verification steps in place during the sign-up process. We
                strongly encourage missionaries to submit letters of
                recommendation from family members or leaders within the
                ministry they are affiliated with. These recommendations help us
                further validate the authenticity of the missionary’s work and
                build trust with potential donors. While this step is not
                mandatory, it adds another layer of transparency and credibility
                to the platform, incentivizing greater confidence from
                supporters.
                <br />
                <br />
                At the heart of everything we do is a desire to create a safe,
                trustworthy space for everyone. Whether you're a donor or a
                missionary, you can rest assured that we are continuously
                working to uphold the highest security standards. From verifying
                identities to building in multiple safeguards, our goal is to
                protect both our missionaries and donors alike, ensuring that
                funds go directly to the intended cause without any risk of
                fraud.
                <br />
                <br />
                Although we can not guarantee the prevention of all fraudulent
                activity, we are committed to fostering an environment where
                generosity is met with trust, so that the mission of sharing the
                gospel can move forward without fear of fraud or misuse.
              </>
            }
          />
          <FAQItemMissionaryLanding
            question="AS A MISSIONARY CAN I USE MY CHURCHES BANK ACCOUNT?"
            index={3}
            openIndex={openIndex}
            handleClick={handleClick}
            answer={
              <>
                We are a Teacher and support platform specifically designed to
                serve missionaries and churches around the globe. Our goal is
                not to replace the systems or methods that already work for your
                ministry, but rather to complement them. We view ourselves as a
                tool that can enhance and amplify your mission by helping you
                share your message and providing a streamlined way for you to
                connect with donors.
                <br />
                <br />
                When it comes to handling donations, we ensure that the process
                is as seamless as possible. All contributions go directly into
                the bank account that you set up on our platform. You have the
                flexibility to choose whether the funds go into your personal
                bank account or directly into your church’s or ministry’s
                account. This gives you control over how the money is managed,
                whether you’re directly active in missionary work or funneling
                resources through a larger organization.
                <br />
                <br />
                However, it’s important to recognize that this decision could
                have tax implications. If the funds are routed to a personal
                account, they may be subject to different tax treatments
                compared to those received by a registered church or ministry.
                To ensure that you’re fully compliant and aware of any tax
                repercussions, we strongly encourage you to consult a tax
                professional before making this decision.
                <br />
                <br />
                Ultimately, our platform is designed to give you flexibility and
                control while making it easier for donors to support your work.
                We want to help you amplify your mission and expand your reach
                without complicating your existing structures, so you can stay
                focused on what matters most—your ministry.
              </>
            }
          />
          <FAQItemMissionaryLanding
            question="ARE MY DONATIONS TAX-DEDUCTIBLE?"
            index={4}
            openIndex={openIndex}
            handleClick={handleClick}
            answer={
              <>
                Night Bright Inc. is a registered 501(c)(3) non-profit
                organization, meaning that all donations made through our
                platform at www.nightbright.org are tax-deductible under U.S.
                law. This allows your contributions to not only support
                missionaries and missional causes but also provide you with
                potential tax benefits.
                <br />
                <br />
                At the end of each year, we provide donors with a comprehensive
                donation statement from our organization. This statement will
                include a record of all the contributions you made through our
                platform during the year, which can be used when preparing your
                tax filings. Our goal is to make the process as simple and
                transparent as possible so you can focus on supporting the
                causes that matter most to you.
                <br />
                <br />
                We deeply value the trust you place in Night Bright and are
                committed to maintaining a high level of transparency and
                accountability. By ensuring that all donations are properly
                tracked and documented, we strive to offer a secure and reliable
                platform for both donors and missionaries alike. Whether you're
                giving once or making recurring contributions, you can have
                peace of mind knowing your donations are both impactful and
                tax-deductible.
                <br />
                <br />
                As always, we recommend consulting a tax professional for
                specific guidance on how these deductions apply to your
                individual situation, but rest assured, Night Bright is here to
                support you every step of the way in your journey of generosity
                and giving.
              </>
            }
          />
          <FAQItemMissionaryLanding
            question="WHO QUALIFIES AS A MISSIONARY ON NIGHT BRIGHT?"
            index={5}
            openIndex={openIndex}
            handleClick={handleClick}
            answer={
              <>
                Missionaries featured on our site must be part of a recognized
                organization and serve in a full-time capacity.
                <br />
                <br />
                We require that they are sent by a church, charity, or missions
                organization, as Night Bright does not provide mentoring,
                equipping, or ongoing care essential for long-term missions.
                <br />
                <br />A full-time missionary is someone committed to serving in
                a specific community or country for several years. Their focus
                is on building relationships, cultural integration, and
                sustainable ministry efforts, often engaging in discipleship,
                education, healthcare, and community development to make a
                lasting impact.
              </>
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

// FAQ Item Component
function FAQItemMissionaryLanding({ question, index, openIndex, handleClick, answer }) {
  const isOpen = openIndex === index;

  return (
    <List component="nav" sx={{ width: "100%", bgcolor: "transparent" }}>
      <ListItem
        button
        onClick={() => handleClick(index)}
        sx={{ color: "#fff", borderBottom: "1px solid #333", py: 1 }}
      >
        <ListItemText primary={question} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4, color: "#ccc", py: 1 }}>
            <ListItemText primary={answer} />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
}