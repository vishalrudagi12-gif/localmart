package com.localbazaar.repository;

import com.localbazaar.entity.Inventory;
import com.localbazaar.entity.Product;
import com.localbazaar.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProduct(Product product);

    Optional<Inventory> findByProductId(Long productId);

    @Modifying
    @Query("delete from Inventory i where i.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    List<Inventory> findByProductSeller(Seller seller);
}
