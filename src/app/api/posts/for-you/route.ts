import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

/**
 * ? no export default in api routes
 * If you used export default, you could only define one function per file, which would limit the ability to handle multiple HTTP methods in the same API route.
 * 
 *  GET and POST are named exports
 * 
 * If you were to use export default, you would be limited to handling only one HTTP method per file, which is less flexible:
 * 
 * export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'This is a GET request' });
  } else if (req.method === 'POST') {
    res.status(200).json({ message: 'This is a POST request' });
  }
}

In this case, you have to manually check the req.method inside a single function, which is less clean and harder to scale if you want to support multiple methods with different logic.
 */

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data); 
    /**
     *  When you're working with APIs, the data returned to the client needs to be serializable because it must be converted into a format (like JSON) that can be transmitted over the network.
     */
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * The cursor is used to determine where to start the query. If a cursor is provided, the query starts from that item; otherwise, it starts from the top.
 * 
 * If the number of items fetched exceeds pageSize, it means there are more items to paginate through, so the ID of the extra item is saved as nextCursor.
 * If there are no more items, nextCursor is set to null.
 * 
 * The data is prepared by slicing the posts array to include only the pageSize items (excluding the extra one used to determine the next cursor).
 * The response includes the posts and the nextCursor.
 * 
 * On the first request, there is no cursor, so the query fetches the first    pageSize + 1 items.
 * The client receives the first page of items and the nextCursor.
 * When the client requests the next page, it sends the nextCursor from the previous response as the cursor parameter.
 * The server then fetches the next set of items starting from that cursor.
 */

/**
 * ?Cursor-based pagination is particularly useful for handling large datasets or data that changes frequently because it avoids the pitfalls of offset-based pagination, such as skipping or duplicating items when data is added or removed between requests. It also tends to be more performant since it doesn’t require counting or scanning the entire dataset to find the offset.
 */

/**
 * * return Response.json(data);
 * Here, data is an object containing the paginated posts and the nextCursor. This object is serializable, meaning it can be converted into a JSON string and sent over the network to the client.
 * 
 *  The data needs to be converted into a string format to be transmitted over HTTP, which is what JSON provides.
 * 
 * By returning serialized data, you ensure that the structure and content of the response are consistent and can be reliably consumed by the client.
 */

/**
 * Data Structures (like objects, arrays, strings, numbers, etc.) are serializable. This is why the data object, which contains an array of posts and a cursor string, can be serialized into JSON and returned to the client.
 * 
 * Functions are not serializable. If you tried to include a function within the data object, it would be ignored during serialization, or an error could occur. This is why we discussed earlier that functions cannot be passed as props in server components—they can't be easily converted to a format like JSON for transmission.
 */

/**
 * *The data needs to be converted into a string format to be transmitted over HTTP, which is what JSON provides.
 * 
 * ?HTTP, the protocol used for web communication, transmits data in a standardized format. The HTTP protocol operates over text-based formats, which means that data needs to be serialized into a text format that can be sent across the network.
 * * 2. Why Use JSON?
 * JSON (JavaScript Object Notation) is a lightweight, text-based format that is used to represent structured data.
 * 
 * Serialization is the process of converting data into a format that can be easily transmitted or stored.
 * For HTTP communication, data is typically serialized into JSON format
 * 
 * ? Convert the JavaScript object into a JSON string
const jsonString = JSON.stringify(data);

// ?Send the JSON string over HTTP
return Response.json(jsonString);
 */

/**
 * Response.json(data): This method converts the data object into a JSON string and sends it as the response body to the client. The data itself remains an object within your server code, but it's serialized into JSON format before being sent over the network.
 * 
 * ?On the client side, when you receive the response:
 * Fetching the Data: When you make a fetch request to your API endpoint, you receive a Response object. You then need to call the .json() method on this Response object to parse the JSON string into a JavaScript object.
 * 
 */