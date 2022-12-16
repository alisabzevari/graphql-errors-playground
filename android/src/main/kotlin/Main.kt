import com.apollographql.apollo3.ApolloClient
import com.choco.GetSupplierQuery

suspend fun main() {
    // Create a client
    val apolloClient = ApolloClient.Builder()
        .serverUrl("http://localhost:4000")
        .build()

    // Execute your query. This will suspend until the response is received.
    val response = apolloClient.query(GetSupplierQuery("3")).execute()

    response.data?.supplier?.__typename

    println("Supplier.name=${response.data?.supplier?.onSupplier?.name}")
 }