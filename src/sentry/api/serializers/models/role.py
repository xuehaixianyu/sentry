from typing import Any, List, Mapping, TypedDict

from sentry.api.serializers import Serializer
from sentry.models import User
from sentry.roles.manager import Role


class RoleSerializerResponse(TypedDict):
    id: str
    name: str
    desc: str
    scopes: List[str]
    is_global: bool
    allowed: bool


class RoleSerializer(Serializer):
    def serialize(
        self,
        obj: Role,
        attrs: Mapping[str, Any],
        user: User,
        **kwargs: Any,
    ) -> RoleSerializerResponse:
        allowed_roles = kwargs.get("allowed_roles") or []

        return {
            "id": str(obj.id),
            "name": obj.name,
            "desc": obj.desc,
            "scopes": obj.scopes,
            "is_global": obj.is_global,
            "allowed": obj in allowed_roles,
        }
