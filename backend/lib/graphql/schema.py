from typing import Optional
import graphene
from graphene import ObjectType, String, Schema
from graphene_sqlalchemy import SQLAlchemyObjectType
from models.user_model import UserModel
from models.vendor_model import VendorModel
from backend.db import db_session

class User(SQLAlchemyObjectType):
  class Meta:
    model = UserModel

class Vendor(SQLAlchemyObjectType):
  class Meta:
    model = VendorModel

class Query(ObjectType):
  users = graphene.List(User)
  user = graphene.Field(User, id=graphene.Int())

  vendors = graphene.List(Vendor)
  vendor = graphene.Field(Vendor, id=graphene.Int())

  def resolve_users(root, info):
    query = User.get_query(info)  # SQLAlchemy query
    return query.all()

  def resolve_user(root, info, id):
    query = User.get_query(info)
    return query.filter(UserModel.id == id).first()

  def resolve_vendors(root, info):
    query = Vendor.get_query(info)  
    return query.all()

  def resolve_vendor(root, info, id):
    query = Vendor.get_query(info)
    return query.filter(UserModel.id == id).first()

class UpdateVendor(graphene.Mutation):
  class Arguments:
    id = graphene.String(required=True)
    name = graphene.String()
    risk = graphene.String()
    category = graphene.String()
    status = graphene.Int()
  
  ok = graphene.Boolean()
  vendor = graphene.Field(Vendor)

  def mutate(self, info, id, name: Optional[str]==None, risk: Optional[str]==None, category: Optional[str]==None,status: Optional[str]==None):
    query = Vendor.get_query(info)
    vendor = query.filter(Vendor.id == id).first()
    if not vendor:
      ok = False
    else:
      if name:
        vendor.name = name
      if risk:
        vendor.risk = risk
      if category:
        vendor.category = category
      if status:
        vendor.status = status
    db_session.commit()
    ok = True
    vendor = vendor
    return UpdateVendor(vendor=vendor, ok=ok)

class Mutation(ObjectType):
  updateVendor = UpdateVendor.Field()
schema = Schema(query=Query)
