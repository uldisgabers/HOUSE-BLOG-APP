const mysql = require("mysql2");
const DB_NAME = "blog_site_database";

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "example",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL server");

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(
    createDatabaseQuery,
    (createDatabaseError, createDatabaseResults) => {
      if (createDatabaseError) {
        console.error("Error creating database:", createDatabaseError);
        connection.end();
        return;
      }

      console.log(`Database "${DB_NAME}" created or already exists`);

      // Switch to the created database
      connection.changeUser({ database: DB_NAME }, (changeUserError) => {
        if (changeUserError) {
          console.error("Error switching to database:", changeUserError);
          connection.end();
          return;
        }

        console.log(`Switched to database "${DB_NAME}"`);

        // ADDING TAGS TABLE -----------------------------------------------------------------------

        // Define the SQL query to create a table if not exists
        const createTableQueryTags = `
        CREATE TABLE IF NOT EXISTS tags (
          tag_id INT AUTO_INCREMENT PRIMARY KEY,
          tag_name VARCHAR(255) NOT NULL
        )`;

        // Execute the query to create the "tags" table
        connection.query(
          createTableQueryTags,
          (createTagsError, createCommentsResults) => {
            if (createTagsError) {
              console.error("Error creating table:", createTagsError);
              connection.end();
              return;
            }

            console.log('Table "tags" created or already exists');

            // Define the SQL query to insert data into the table
            const insertDataQueryTags = `
            INSERT INTO tags (tag_name) VALUES
              ('Travel'),
              ('Household'),
              ('Construction')
            `;

            // Execute the query to insert data
            connection.query(
              insertDataQueryTags,
              (insertDataError, insertDataResults) => {
                if (insertDataError) {
                  console.error("Error inserting data:", insertDataError);
                } else {
                  console.log("Data inserted or already exists");
                }

                // Close the connection
                connection.end();
              }
            );
          }
        );

        // Create posts table --------------------------------------------------------------------------

        // Define the SQL query to create a table if not exists
        const createTableQueryPosts = `
        CREATE TABLE IF NOT EXISTS posts (
          post_id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          img TEXT NOT NULL,
          content TEXT NOT NULL,
          createdAt VARCHAR(255) NOT NULL,
          tag_id INT,
          FOREIGN KEY(tag_id) REFERENCES tags(tag_id)
        )`;

        // Execute the query to create the table
        connection.query(
          createTableQueryPosts,
          (createTableError, createTableResults) => {
            if (createTableError) {
              console.error("Error creating table:", createTableError);
              connection.end();
              return;
            }

            console.log('Table "posts" created or already exists');

            // Define the SQL query to insert data into the table
            const insertDataQuery = `
            INSERT INTO posts (title, img, content, createdAt, tag_id) VALUES
              ('Best A-frame Houses', 'https://tahoequarterly.com/wp-content/uploads/2021/02/1411Sequoia03.jpg', 'A-frame houses epitomize timeless architectural elegance. Their distinctive triangular shape not only exudes charm but also maximizes interior space. These versatile structures seamlessly blend modern aesthetics with a rustic touch, creating cozy retreats or contemporary masterpieces. The steep roofline efficiently sheds snow and rain while providing soaring ceilings within. A-frames often feature large windows, inviting natural light to illuminate the open-plan interiors. Embracing simplicity and efficiency, these homes offer an ideal canvas for personalized design, making A-frame houses a symbol of architectural ingenuity and a beloved choice for those seeking a harmonious blend of form and function.','2023-11-21T20:32:45.273Z', '1'),
              ('Your New Home - In the Forrest', 'https://miro.medium.com/v2/resize:fit:2000/1*QLE2xpNUFPVBhfag3Dud3w.jpeg', 'Enchanting forest homes epitomize a harmonious union between architecture and nature. Nestled amidst towering trees, these dwellings embrace serenity, offering a secluded haven away from the hustle of urban life. Floor-to-ceiling windows invite the outdoors in, providing uninterrupted views of lush foliage. Whether blending seamlessly into the landscape or standing out as modern marvels, these forest abodes echo with the soothing sounds of rustling leaves and birdsong. Each home becomes a retreat, where the rhythm of nature dictates the pace, creating an idyllic sanctuary where tranquility and architectural beauty converge in perfect equilibrium.','2023-11-21T20:32:45.273Z', '2'),
              ('Remodel Your House in a Month or Less', 'https://www.thespruce.com/thmb/7fZFC7TMbs99m7A5oCpaCAh6g00=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/147585440_771046427096836_8431768065271948826_n-ea642eb2ff0443a3b1558d376438341e.jpg', 'Transforming a home in a month is a whirlwind of creativity and efficiency. The clock ticks as walls gain new hues, floors acquire fresh textures, and spaces evolve with purpose. With meticulous planning, skilled artisans breathe life into visions, crafting a symphony of design. Rapid decisions and resourcefulness become allies, shaping a dream dwelling within the tight deadline. Each day unfolds with the anticipation of a revamped haven, where the essence of personal style emerges from the chaos. Remodeling in a month is a sprint, a testament to the transformative power of dedication and a well-choreographed dance with time.','2023-11-21T20:32:45.273Z', '3'),
              ('Embark on a Unique Journey - Exploring Beautiful Airbnbs Around the World', 'https://www.travelandleisure.com/thmb/Us22v1roQ1G8emUedU8HVtRNrC8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-family-checking-in-airbnb-AIRBNBFEES1122-743025de0c114f66a216ed58cc9f628e.jpg', 'In a world brimming with exciting possibilities, travel enthusiasts are increasingly seeking unique and memorable experiences. One of the ways to make your journey extraordinary is by choosing accommodations that go beyond the ordinary. Enter Airbnb, a platform that opens the door to a plethora of charming and beautiful spaces that redefine the way we travel. A Symphony of Diversity: Airbnbs Global Tapestry The beauty of Airbnb lies in its ability to showcase a rich tapestry of accommodations around the world. Whether nestled in the heart of bustling cities, perched on serene mountainsides, or dotting tranquil beaches, these unique spaces promise an immersive travel experience. From treehouses in Costa Rica to houseboats in Amsterdam, each Airbnb presents a chance to escape the mundane and embrace the extraordinary. Personalized Experiences: More Than Just a Place to Stay. Airbnbs are not just places to rest your head; they are gateways to cultural immersion and personalized experiences. Hosts often go above and beyond to provide insider tips, local recommendations, and a warm welcome that transcends the traditional hotel experience. Whether its a cozy cabin in the woods or an artists loft in a vibrant neighborhood, the connection with the host and the surroundings creates memories that last a lifetime.','2023-12-27T20:32:45.273Z', '1')
            `;

            // Execute the query to insert data
            connection.query(
              insertDataQuery,
              (insertDataError, insertDataResults) => {
                if (insertDataError) {
                  console.error("Error inserting data:", insertDataError);
                } else {
                  console.log("Data inserted or already exists");
                }

                // Close the connection
                connection.end();
              }
            );
          }
        );

        // ADDING COMMENTS TABLE ------------------------------------------------------------------

        // Define the SQL query to create a table if not exists
        const createTableQueryComments = `
        CREATE TABLE IF NOT EXISTS comments (
          comment_id INT AUTO_INCREMENT PRIMARY KEY,
          author VARCHAR(255) NOT NULL,
          comment TEXT NOT NULL,
          createdAt VARCHAR(255) NOT NULL,
          post_id INT,
          FOREIGN KEY(post_id) REFERENCES posts(post_id)
        )`;

        // Execute the query to create the "comments" table
        connection.query(
          createTableQueryComments,
          (createCommentsError, createCommentsResults) => {
            if (createCommentsError) {
              console.error("Error creating table:", createCommentsError);
              connection.end();
              return;
            }

            console.log('Table "comments" created or already exists');

            // Define the SQL query to insert data into the table
            const insertDataQueryComments = `
            INSERT INTO comments (author, comment, createdAt, post_id) VALUES
              ('Tony', 'Very nice, I liked it','2023-11-23T20:32:45.273Z', 1),
              ('John Deer', 'Nice blog','2023-11-23T20:32:45.273Z', 2),
              ('Antonio Pamperas', 'This post was too good','2023-11-23T20:32:45.273Z', 3)
            `;

            // Execute the query to insert data
            connection.query(
              insertDataQueryComments,
              (insertDataError, insertDataResults) => {
                if (insertDataError) {
                  console.error("Error inserting data:", insertDataError);
                } else {
                  console.log("Data inserted or already exists");
                }

                // Close the connection
                connection.end();
              }
            );
          }
        );

        // Define the SQL query to create a table if not exists
        const createTableQueryUsers = `
        CREATE TABLE IF NOT EXISTS users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL
        )`;

        // Execute the query to create the "users" table
        connection.query(
          createTableQueryUsers,
          (createUsersError, createUsersResults) => {
            if (createUsersError) {
              console.error("Error creating table:", createUsersError);
              connection.end();
              return;
            }

            console.log('Table "users" created or already exists');

            // Define the SQL query to insert data into the table
            const insertDataQueryUsers = `
            INSERT INTO users (username, password, name, email) VALUES
              ('admin', 'admin','Admin', 'admin@admin.com')
            `;

            // Execute the query to insert data
            connection.query(
              insertDataQueryUsers,
              (insertDataError, insertDataResults) => {
                if (insertDataError) {
                  console.error("Error inserting data:", insertDataError);
                } else {
                  console.log("Data inserted or already exists");
                }

                // Close the connection
                connection.end();
              }
            );
          }
        );

        
      });
    }
  );
});
