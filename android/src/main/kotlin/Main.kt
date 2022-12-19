import com.apollographql.apollo3.ApolloClient
import com.choco.GetUserQuery
import com.choco.GetUserResultQuery
import com.choco.GetUserUnionQuery
import com.choco.type.ResponseType
import kotlin.system.exitProcess

// Create a client
val apolloClient = ApolloClient.Builder()
    .serverUrl("http://localhost:4000")
    .build()

suspend fun getUser(id: String): String? {
    // Look here for more details: https://www.apollographql.com/docs/kotlin/essentials/errors

    val response = apolloClient.query(GetUserQuery(id)).execute()

    val errorCode = if (response.hasErrors()) {
        response.errors?.first()?.extensions?.get("code").toString()
    } else null

    return response.data?.user?.name ?: errorCode
}

suspend fun getUserUnionQuery(id: String): String? {
    val response = apolloClient.query(GetUserUnionQuery(id)).execute()

    val name = response.data?.userUnion?.onUser?.name

    val errorType = response.data?.userUnion?.onErrorResponse?.type

    return name ?: errorType
}

suspend fun getUserResultQuery(id: String): String? {
    val response = apolloClient.query(GetUserResultQuery(id)).execute()

    return when (response.data?.userResult?.type) {
        ResponseType.SUCCESS -> response.data?.userResult?.success?.name
        ResponseType.ERROR -> response.data?.userResult?.error?.type
        ResponseType.UNKNOWN__ -> TODO()
        null -> TODO()
    }
}

suspend fun main() {
    val id = "4"
    println("Union: ${getUserUnionQuery(id)}")
    println("Result: ${getUserResultQuery(id)}")
    println("User: ${getUser(id)}")
    exitProcess(0)
}
